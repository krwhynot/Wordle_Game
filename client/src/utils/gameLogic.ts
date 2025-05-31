/**
 * Game logic utilities for F&B Wordle
 */
import type { TileState } from '../types/game';
import { WORD_VALIDATION_ENDPOINT } from './constants';

/**
 * Validates if a word is a valid F&B term
 */
export async function checkIsWordValid(guess: string): Promise<boolean> {
  try {
    // In production, this would call the API endpoint to validate the word
    // For now, we'll just check if it's 5 letters (mock implementation)
    
    // Uncomment to use actual API
    // const response = await fetch(WORD_VALIDATION_ENDPOINT, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ word: guess }),
    // });
    // const data = await response.json();
    // return data.valid;
    
    // Mock implementation
    return guess.length === 5;
  } catch (error) {
    console.error('Error validating word:', error);
    return false;
  }
}

/**
 * Evaluates a guess against the target word
 * Returns an array of states for each letter:
 * - 'correct': letter is in the correct position
 * - 'present': letter is in the word but wrong position
 * - 'absent': letter is not in the word
 */
export function evaluateGuess(guess: string, targetWord: string): TileState[] {
  const result: TileState[] = Array(guess.length).fill('absent');
  const targetLetters = targetWord.split('');
  const letterOccurrences: Record<string, number> = {};
  
  // Count occurrences of each letter in the target word
  targetLetters.forEach(letter => {
    letterOccurrences[letter] = (letterOccurrences[letter] || 0) + 1;
  });
  
  // First pass: check for correct letters
  for (let i = 0; i < guess.length; i++) {
    const guessLetter = guess[i];
    if (guessLetter === targetLetters[i]) {
      result[i] = 'correct';
      letterOccurrences[guessLetter]--;
    }
  }
  
  // Second pass: check for present letters
  for (let i = 0; i < guess.length; i++) {
    const guessLetter = guess[i];
    if (result[i] === 'absent' && letterOccurrences[guessLetter] > 0) {
      result[i] = 'present';
      letterOccurrences[guessLetter]--;
    }
  }
  
  return result;
}

/**
 * Checks if the game is over
 */
export function isGameOver(guessStates: TileState[][], maxGuesses: number): boolean {
  const lastGuess = guessStates.find(Boolean);
  const isWon = lastGuess && lastGuess.every(state => state === 'correct');
  const isLost = guessStates.filter(Boolean).length >= maxGuesses;
  
  return isWon || isLost;
}

/**
 * Checks if the game is won
 */
export function isGameWon(guessStates: TileState[][]): boolean {
  return guessStates.some(guess => guess && guess.every(state => state === 'correct'));
}
