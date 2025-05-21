import { Request, Response } from 'express';
import wordService from '../services/wordService';
import dictionaryService from '../services/dictionaryService';
import { logger } from '../utils/logger';

/**
 * Word-related controller functions
 */
export const wordController = {
  /**
   * Get daily word
   */
  async getDailyWord(req: Request, res: Response) {
    try {
      const word = await wordService.getDailyWord();

      return res.status(200).json({
        success: true,
        data: { word }
      });
    } catch (error) {
      logger.error('Error in getDailyWord:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve daily word'
      });
    }
  },

  /**
   * Validate a word
   */
  async validateWord(req: Request, res: Response) {
    try {
      const { word } = req.body;

      // First check our database
      let isValid = await wordService.validateWord(word);

      // If not in our database, check external dictionary API
      if (!isValid) {
        isValid = await dictionaryService.wordExists(word);
      }

      return res.status(200).json({
        success: true,
        data: {
          word,
          valid: isValid
        }
      });
    } catch (error) {
      logger.error('Error in validateWord:', error);
      return res.status(500).json({
        success: false,
        error: 'Word validation failed'
      });
    }
  }
};
