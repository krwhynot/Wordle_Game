/// <reference types="jest" />
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

// Mock dependencies
const mockGetDailyWord = jest.fn();
const mockValidateWord = jest.fn();
const mockWordService = {
  getDailyWord: mockGetDailyWord,
  validateWord: mockValidateWord,
};

const mockWordExists = jest.fn();
const mockDictionaryService = {
  wordExists: mockWordExists,
};

const mockWordValidationLimiter = jest.fn((req: Request, res: Response, next: NextFunction) => next());
const mockValidateWordGuess = jest.fn(() => jest.fn((req: Request, res: Response, next: NextFunction) => next()));

jest.mock('../../services/wordService', () => ({
  __esModule: true,
  default: mockWordService,
}));
jest.mock('../../services/dictionaryService', () => ({
  __esModule: true,
  default: mockDictionaryService,
}));
jest.mock('../../middleware/rateLimiter', () => ({
  wordValidationLimiter: mockWordValidationLimiter,
}));
jest.mock('../../middleware/validation', () => ({
  validateWordGuess: mockValidateWordGuess,
}));
jest.mock('../../utils/logger');

// Import routes after mocks are defined
import wordRoutes from '../../routes/wordRoutes';

// Create a test Express app
const app = express();
app.use(express.json());

app.use('/word', wordRoutes); // Mount word routes under /word

describe('Word API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /word/daily', () => {
    it('should return 200 OK with the daily word', async () => {
      mockGetDailyWord.mockResolvedValueOnce('dailyw');

      const response = await request(app).get('/word/daily');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true, data: { word: 'dailyw' } });
      expect(mockGetDailyWord).toHaveBeenCalledTimes(1);
    });

    it('should return 500 Internal Server Error if wordService.getDailyWord throws an error', async () => {
      mockGetDailyWord.mockRejectedValueOnce(new Error('Failed to retrieve daily word'));

      const response = await request(app).get('/word/daily');

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ success: false, error: 'Failed to retrieve daily word' });
      expect(mockGetDailyWord).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /word/validate', () => {
    it('should return 200 OK with valid: true for a valid word (in DB)', async () => {
      mockValidateWord.mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/word/validate')
        .send({ word: 'hello' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true, data: { word: 'hello', valid: true } });
      expect(mockValidateWord).toHaveBeenCalledTimes(1);
      expect(mockValidateWord).toHaveBeenCalledWith('hello');
      expect(mockWordExists).not.toHaveBeenCalled();
    });

    it('should return 200 OK with valid: true for a valid word (external dictionary)', async () => {
      mockValidateWord.mockResolvedValueOnce(false);
      mockWordExists.mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/word/validate')
        .send({ word: 'world' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true, data: { word: 'world', valid: true } });
      expect(mockValidateWord).toHaveBeenCalledTimes(1);
      expect(mockValidateWord).toHaveBeenCalledWith('world');
      expect(mockWordExists).toHaveBeenCalledTimes(1);
      expect(mockWordExists).toHaveBeenCalledWith('world');
    });

    it('should return 200 OK with valid: false for an invalid word', async () => {
      mockValidateWord.mockResolvedValueOnce(false);
      mockWordExists.mockResolvedValueOnce(false);

      const response = await request(app)
        .post('/word/validate')
        .send({ word: 'asdfg' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ success: true, data: { word: 'asdfg', valid: false } });
      expect(mockValidateWord).toHaveBeenCalledTimes(1);
      expect(mockWordExists).toHaveBeenCalledTimes(1);
    });

    it('should return 500 Internal Server Error if wordService.validateWord throws an error', async () => {
      mockValidateWord.mockRejectedValueOnce(new Error('Word validation failed'));

      const response = await request(app)
        .post('/word/validate')
        .send({ word: 'error' });

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ success: false, error: 'Word validation failed' });
      expect(mockValidateWord).toHaveBeenCalledTimes(1);
      expect(mockWordExists).not.toHaveBeenCalled();
    });
  });
});
