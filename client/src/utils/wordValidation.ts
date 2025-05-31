/**
 * Word validation utilities for F&B Wordle
 * 
 * Provides functions for validating words against the F&B dictionary
 * and checking for valid word formats.
 */
import { FB_WORDS } from '../data/fbWords';

/**
 * Validates if a word exists in the F&B dictionary
 * 
 * @param word - The word to check
 * @returns True if the word exists in the dictionary
 */
export function isValidFBWord(word: string): boolean {
  return FB_WORDS.includes(word.toLowerCase());
}

/**
 * Validates if a word is the correct length for the game
 * 
 * @param word - The word to check
 * @param length - Expected word length (default: 5)
 * @returns True if the word is the correct length
 */
export function isCorrectLength(word: string, length: number = 5): boolean {
  return word.length === length;
}

/**
 * Validates if a word contains only letters
 * 
 * @param word - The word to check
 * @returns True if the word contains only letters
 */
export function containsOnlyLetters(word: string): boolean {
  return /^[a-zA-Z]+$/.test(word);
}

/**
 * Comprehensive word validation for game input
 * 
 * @param word - The word to validate
 * @returns Validation result with reason if invalid
 */
export function validateGameWord(word: string): { valid: boolean; reason?: string } {
  if (!word) {
    return { valid: false, reason: 'Word cannot be empty' };
  }
  
  if (!isCorrectLength(word)) {
    return { valid: false, reason: 'Word must be exactly 5 letters' };
  }
  
  if (!containsOnlyLetters(word)) {
    return { valid: false, reason: 'Word can only contain letters' };
  }
  
  if (!isValidFBWord(word)) {
    return { valid: false, reason: 'Not in food & beverage word list' };
  }
  
  return { valid: true };
}

export default {
  isValidFBWord,
  isCorrectLength,
  containsOnlyLetters,
  validateGameWord
};
