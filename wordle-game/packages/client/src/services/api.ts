/**
 * API service for making requests to the backend
 */
export const api = {
  /**
   * Get daily word
   */
  async getDailyWord(): Promise<string> {
    try {
      const response = await fetch('/api/word/daily');

      if (!response.ok) {
        throw new Error('Failed to fetch daily word');
      }

      const data = await response.json();
      return data.data.word;
    } catch (error) {
      console.error('Error fetching daily word:', error);
      // Fallback word in case of API failure
      return 'react';
    }
  },

  /**
   * Validate a word
   */
  async validateWord(word: string): Promise<boolean> {
    try {
      const response = await fetch('/api/word/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        throw new Error('Word validation failed');
      }

      const data = await response.json();
      return data.data.valid;
    } catch (error) {
      console.error('Error validating word:', error);
      return false;
    }
  }
};

export default api;
