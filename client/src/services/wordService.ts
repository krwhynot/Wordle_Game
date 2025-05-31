/**
 * Word Service Module
 * 
 * Provides API services for word-related functionality:
 * - Validating word guesses
 * - Retrieving daily words
 * - Managing word lists
 */
import { post, get, type ApiResponse } from './api';

// Type definitions for the responses
export interface ValidateWordResponse {
  guess: string;
  valid: boolean;
  reason?: string | null;
}

export interface DailyWordResponse {
  word: string;
  date: string;
}

/**
 * Mock API data for development without a backend
 */
const MOCK_VALID_WORDS = ['SAUTE', 'FLOUR', 'KNIFE', 'BRAZE', 'GRILL', 'PLATE', 'CREAM'];

/**
 * Validates a word guess against the F&B wordlist
 * 
 * @param guess - The word to validate
 * @returns Promise with validation result
 */
export const validateWord = async (guess: string): Promise<ApiResponse<ValidateWordResponse>> => {
  // Check for empty input
  if (!guess) {
    return {
      error: 'Guess cannot be empty',
      status: 400
    };
  }

  try {
    // Check environment flag for mock API
    if (import.meta.env.VITE_APP_ENABLE_MOCK_API === 'true') {
      // Mock API response for development
      const normalizedGuess = guess.toUpperCase();
      return {
        data: {
          guess: normalizedGuess,
          valid: MOCK_VALID_WORDS.includes(normalizedGuess),
          reason: !MOCK_VALID_WORDS.includes(normalizedGuess) ? 'Not a valid F&B term' : null
        },
        status: 200
      };
    }

    // Real API call
    return await post<ValidateWordResponse>('validateGuess', { guess });
  } catch (error) {
    console.error('Error validating word:', error);
    return {
      error: 'Failed to validate word',
      status: 500
    };
  }
};

/**
 * Retrieves the daily word for the game
 * 
 * @returns Promise with the daily word
 */
export const getDailyWord = async (): Promise<ApiResponse<DailyWordResponse>> => {
  try {
    // Check environment flag for mock API
    if (import.meta.env.VITE_APP_ENABLE_MOCK_API === 'true') {
      // Mock API response for development
      const today = new Date().toISOString().split('T')[0];
      // Deterministically select a word based on date
      const dateNum = parseInt(today.replace(/-/g, ''), 10);
      const wordIndex = dateNum % MOCK_VALID_WORDS.length;
      
      return {
        data: {
          word: MOCK_VALID_WORDS[wordIndex],
          date: today
        },
        status: 200
      };
    }

    // Real API call
    return await get<DailyWordResponse>('dailyWord');
  } catch (error) {
    console.error('Error getting daily word:', error);
    return {
      error: 'Failed to get daily word',
      status: 500
    };
  }
};
