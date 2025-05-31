/**
 * Game logic utilities for F&B Wordle
 */
import type { TileState } from '../types/game';
import { FB_WORDS } from '../data/fbWords';
import type { GameResult, PlayerStatistics } from '../services/statisticsService';

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
  // Check if any row is all correct
  return guessStates.some(row => 
    row.length > 0 && row.every(state => state === 'correct')
  );
}

/**
 * Returns a random word from the F&B dictionary
 * 
 * @returns A random 5-letter F&B term
 */
export function getRandomWord(): string {
  return FB_WORDS[Math.floor(Math.random() * FB_WORDS.length)];
}

/**
 * Calculates player statistics based on game results
 * 
 * @param results - Array of game results
 * @param sessionId - Player's session ID
 * @returns Calculated player statistics
 */
export function calculateStatistics(results: GameResult[], sessionId: string): PlayerStatistics {
  // Filter results for this session
  const sessionResults = results.filter(r => r.sessionId === sessionId);
  
  if (sessionResults.length === 0) {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      averageGuesses: 0,
      guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      lastPlayed: null
    };
  }
  
  // Sort by date, most recent first
  const sortedResults = [...sessionResults].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const gamesPlayed = sessionResults.length;
  const gamesWon = sessionResults.filter(r => r.success).length;
  const lastPlayed = sortedResults[0]?.date || null;
  
  // Calculate streaks
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  
  for (let i = 0; i < sortedResults.length; i++) {
    if (sortedResults[i].success) {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
      
      // Check if this is the most recent streak
      if (i === 0) {
        currentStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
      if (i === 0) {
        currentStreak = 0;
      }
    }
  }
  
  // Calculate guess distribution
  const guessDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  sessionResults.forEach(result => {
    if (result.success && result.guesses >= 1 && result.guesses <= 6) {
      guessDistribution[result.guesses]++;
    }
  });
  
  // Calculate average guesses (only for successful games)
  const successfulGames = sessionResults.filter(r => r.success);
  const totalGuesses = successfulGames.reduce((sum, r) => sum + r.guesses, 0);
  const averageGuesses = successfulGames.length > 0 
    ? Math.round((totalGuesses / successfulGames.length) * 10) / 10
    : 0;
  
  return {
    gamesPlayed,
    gamesWon,
    currentStreak,
    maxStreak,
    averageGuesses,
    guessDistribution,
    lastPlayed
  };
}

/**
 * Formats game result for sharing
 * 
 * @param result - The game result to format
 * @param evaluations - The tile evaluations for each guess
 * @returns Formatted text for sharing
 */
export function formatShareableResult(result: GameResult, evaluations: TileState[][]): string {
  const date = new Date(result.date);
  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  
  let shareText = `F&B Wordle ${dateString} - ${result.success ? result.guesses : 'X'}/6\n\n`;
  
  // Add emoji pattern based on evaluations
  evaluations.forEach(row => {
    if (row.length > 0) {
      const rowEmojis = row.map(state => {
        switch (state) {
          case 'correct': return '🟩';
          case 'present': return '🟨';
          case 'absent': return '⬛';
          default: return '';
        }
      }).join('');
      shareText += `${rowEmojis}\n`;
    }
  });
  
  return shareText;
}
