import { getDatabase } from '../config/db';
import { WORDS_COLLECTION, WordDocument } from '../models/Word';
import { generateDateSeed } from '../utils/seedGenerator';
import { logger } from '../utils/logger';

/**
 * Word Service for database operations
 */
export class WordService {
  /**
   * Get daily word based on date
   */
  async getDailyWord(): Promise<string> {
    try {
      const db = await getDatabase();
      const collection = db.collection<WordDocument>(WORDS_COLLECTION);

      // Generate a seed based on today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const seed = generateDateSeed(today);

      // Find word based on seed
      const seedForSort = seed % 2 === 0 ? 1 : -1; // Convert seed to valid sort direction (1 or -1)
      const wordDoc = await collection
        .find({
          lastUsed: { $lt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) }
        })
        .sort({ _id: seedForSort }) // Using seed for "random" but deterministic sorting
        .limit(1)
        .toArray();

      if (wordDoc.length === 0) {
        throw new Error('No words available for today');
      }

      // Update lastUsed date
      await collection.updateOne(
        { _id: wordDoc[0]._id },
        { $set: { lastUsed: today } }
      );

      return wordDoc[0].word;
    } catch (error) {
      logger.error('Error getting daily word:', error);
      return 'react'; // Fallback word in case of database error
    }
  }

  /**
   * Check if a word exists in the dictionary
   */
  async validateWord(word: string): Promise<boolean> {
    try {
      const db = await getDatabase();
      const collection = db.collection<WordDocument>(WORDS_COLLECTION);

      const wordDoc = await collection.findOne({
        word: word.toLowerCase()
      });

      return !!wordDoc;
    } catch (error) {
      logger.error('Error validating word:', error);
      return false;
    }
  }

  /**
   * Initialize word list with sample data (for development)
   */
  async initializeWordList(words: string[]): Promise<void> {
    try {
      const db = await getDatabase();
      const collection = db.collection<WordDocument>(WORDS_COLLECTION);

      // Check if collection is empty
      const count = await collection.countDocuments();
      if (count > 0) {
        logger.info('Word list already initialized');
        return;
      }

      // Insert sample words
      const wordDocs: WordDocument[] = words.map(word => ({
        word: word.toLowerCase(),
        lastUsed: new Date(0) // Never used
      }));

      await collection.insertMany(wordDocs);
      logger.info(`Initialized word list with ${wordDocs.length} words`);
    } catch (error) {
      logger.error('Error initializing word list:', error);
      throw error;
    }
  }
}

export default new WordService();
