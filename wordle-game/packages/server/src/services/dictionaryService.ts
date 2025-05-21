import axios from 'axios';
import { logger } from '../utils/logger';

/**
 * Service for external dictionary API interactions
 */
export class DictionaryService {
  private apiBaseUrl: string;
  private apiKey: string;

  constructor() {
    this.apiBaseUrl = process.env.DICTIONARY_API_URL || '';
    this.apiKey = process.env.DICTIONARY_API_KEY || '';
  }

  /**
   * Check if a word exists in an external dictionary
   * This is a backup for words not in our database
   */
  async wordExists(word: string): Promise<boolean> {
    try {
      // If no API configuration, return false
      if (!this.apiBaseUrl || !this.apiKey) {
        logger.warn('Dictionary API not configured');
        return false;
      }

      const response = await axios.get(`${this.apiBaseUrl}/entries/en/${word.toLowerCase()}`, {
        headers: {
          'app_id': this.apiKey,
          'app_key': this.apiKey
        }
      });

      return response.status === 200;
    } catch (error) {
      logger.error('Dictionary API error:', error);
      return false;
    }
  }
}

export default new DictionaryService();
