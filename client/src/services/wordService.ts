/**
 * Word Service Module
 * 
 * Provides API services for word-related functionality:
 * - Validating word guesses
 * - Retrieving daily words
 * - Managing word lists
 */
import { post, get, type ApiResponse } from './api';
import { FB_WORDS, isValidFBWord } from '../data/fbWords';

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
 * Use FB_WORDS dictionary for validation and word selection
 */

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
      // Mock API response for development using our FB_WORDS dictionary
      const normalizedGuess = guess.toUpperCase();
      return {
        data: {
          guess: normalizedGuess,
          valid: isValidFBWord(normalizedGuess),
          reason: !isValidFBWord(normalizedGuess) ? 'Not a valid F&B term' : null
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
      // Mock API response for development using FB_WORDS dictionary
      const today = new Date().toISOString().split('T')[0];
      // Deterministically select a word based on date
      const dateNum = parseInt(today.replace(/-/g, ''), 10);
      const wordIndex = dateNum % FB_WORDS.length;
      
      return {
        data: {
          word: FB_WORDS[wordIndex],
          date: today
        },
        status: 200
      };
    }

    // Real API call
    return await get<DailyWordResponse>('dailyWord');
  } catch (error) {
    console.error('Error getting daily word:', error);
    // Fallback to mock daily word if real API call fails [REH]
    const today = new Date().toISOString().split('T')[0];
    const dateNum = parseInt(today.replace(/-/g, ''), 10);
    const wordIndex = dateNum % FB_WORDS.length;
    return {
      data: { word: FB_WORDS[wordIndex], date: today },
      status: 200
    };
  }
};
