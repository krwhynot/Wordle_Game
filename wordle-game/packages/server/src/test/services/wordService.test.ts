import { MongoClient, Collection, Db, ObjectId } from 'mongodb';
import { WordService } from '../../services/wordService';
import { WordDocument, WORDS_COLLECTION } from '../../models/Word';
import { generateDateSeed } from '../../utils/seedGenerator';
import { logger } from '../../utils/logger';

// Mock logger to prevent console output during tests
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock generateDateSeed to control deterministic word selection
jest.mock('../../utils/seedGenerator', () => ({
  generateDateSeed: jest.fn(),
}));

// Mock MongoDB connection
const mockCollection = {
  find: jest.fn().mockReturnThis() as unknown as jest.Mock,
  sort: jest.fn().mockReturnThis() as unknown as jest.Mock,
  limit: jest.fn().mockReturnThis() as unknown as jest.Mock,
  toArray: jest.fn() as unknown as jest.Mock,
  updateOne: jest.fn() as unknown as jest.Mock,
  countDocuments: jest.fn() as unknown as jest.Mock,
  insertMany: jest.fn() as unknown as jest.Mock,
  findOne: jest.fn() as unknown as jest.Mock,
} as unknown as Collection<WordDocument>;

const mockDb = {
  collection: jest.fn(() => mockCollection) as unknown as jest.Mock,
} as unknown as Db;

const mockClient = {
  db: jest.fn(() => mockDb) as unknown as jest.Mock,
  connect: jest.fn() as unknown as jest.Mock,
  close: jest.fn() as unknown as jest.Mock,
} as unknown as MongoClient;

// Mock the db.ts module
jest.mock('../../config/db', () => ({
  connectToDatabase: jest.fn(async () => ({ client: mockClient, db: mockDb })),
  getDatabase: jest.fn(async () => mockDb),
  closeDatabaseConnection: jest.fn(),
}));

describe('WordService', () => {
  let wordService: WordService;

  beforeEach(() => {
    wordService = new WordService();
    jest.clearAllMocks();
  });

  describe('getDailyWord', () => {
    it('should return a deterministic word based on the current date and update its lastUsed field', async () => {
      const mockWordDoc: WordDocument = { _id: new ObjectId(), word: 'testw', lastUsed: new Date(0) };
      (mockCollection.toArray as jest.Mock).mockResolvedValueOnce([mockWordDoc]);
      (generateDateSeed as jest.Mock).mockReturnValue(122); // Mock an even seed to make seedForSort -1

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const word = await wordService.getDailyWord();

      expect(word).toBe('testw');
      expect(generateDateSeed).toHaveBeenCalledWith(today);
      expect(mockCollection.find).toHaveBeenCalledWith({
        lastUsed: { $lt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) }
      });
      expect(mockCollection.sort).toHaveBeenCalledWith({ _id: 1 }); // 123 % 2 === 1
      expect(mockCollection.limit).toHaveBeenCalledWith(1);
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { _id: mockWordDoc._id },
        { $set: { lastUsed: today } }
      );
    });

    it('should return the fallback word "react" if an error occurs during database operation', async () => {
      (mockCollection.toArray as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

      const word = await wordService.getDailyWord();

      expect(word).toBe('react');
      expect(logger.error).toHaveBeenCalledWith('Error getting daily word:', expect.any(Error));
    });

    it('should handle scenario where no words are available and return fallback', async () => {
      (mockCollection.toArray as jest.Mock).mockResolvedValueOnce([]);

      const word = await wordService.getDailyWord();

      expect(word).toBe('react');
      expect(logger.error).toHaveBeenCalledWith('Error getting daily word:', expect.any(Error));
      expect((logger.error as jest.Mock).mock.calls[0][1].message).toBe('No words available for today');
    });
  });

  describe('validateWord', () => {
    it('should return true if the word exists in the collection (case-insensitive)', async () => {
      (mockCollection.findOne as jest.Mock).mockResolvedValueOnce({ word: 'hello' });

      const isValid = await wordService.validateWord('Hello');
      expect(isValid).toBe(true);
      expect(mockCollection.findOne).toHaveBeenCalledWith({ word: 'hello' });
    });

    it('should return false if the word does not exist in the collection', async () => {
      (mockCollection.findOne as jest.Mock).mockResolvedValueOnce(null);

      const isValid = await wordService.validateWord('nonexistent');
      expect(isValid).toBe(false);
    });

    it('should return false if an error occurs during database operation', async () => {
      (mockCollection.findOne as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

      const isValid = await wordService.validateWord('test');
      expect(isValid).toBe(false);
      expect(logger.error).toHaveBeenCalledWith('Error validating word:', expect.any(Error));
    });
  });

  describe('initializeWordList', () => {
    it('should insert sample words if the collection is empty', async () => {
      (mockCollection.countDocuments as jest.Mock).mockResolvedValueOnce(0);
      const sampleWords = ['react', 'cloud', 'azure'];

      await wordService.initializeWordList(sampleWords);

      expect(mockCollection.countDocuments).toHaveBeenCalled();
      expect(mockCollection.insertMany).toHaveBeenCalledTimes(1);
      expect(mockCollection.insertMany).toHaveBeenCalledWith(
        sampleWords.map(word => ({
          word: word.toLowerCase(),
          lastUsed: new Date(0)
        }))
      );
      expect(logger.info).toHaveBeenCalledWith(`Initialized word list with ${sampleWords.length} words`);
    });

    it('should not add duplicate words if the collection is already populated', async () => {
      (mockCollection.countDocuments as jest.Mock).mockResolvedValueOnce(5); // Collection not empty
      const sampleWords = ['react', 'cloud'];

      await wordService.initializeWordList(sampleWords);

      expect(mockCollection.countDocuments).toHaveBeenCalled();
      expect(mockCollection.insertMany).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Word list already initialized');
    });

    it('should throw an error if an error occurs during initialization', async () => {
      (mockCollection.countDocuments as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
      const sampleWords = ['react'];

      await expect(wordService.initializeWordList(sampleWords)).rejects.toThrow('DB error');
      expect(logger.error).toHaveBeenCalledWith('Error initializing word list:', expect.any(Error));
    });
  });
});
