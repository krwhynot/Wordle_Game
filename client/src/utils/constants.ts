/**
 * Game constants for F&B Wordle
 */

// Word length for the game (standard Wordle uses 5)
export const WORD_LENGTH = 5;

// Maximum number of guesses allowed
export const MAX_GUESSES = 6;

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:7071/api';
export const WORD_VALIDATION_ENDPOINT = `${API_BASE_URL}/validate-word`;
export const DAILY_WORD_ENDPOINT = `${API_BASE_URL}/daily-word`;
export const SUBMIT_RESULT_ENDPOINT = `${API_BASE_URL}/submit-result`;

// Create an empty board based on word length and max guesses
export const createEmptyTile = () => ({ letter: '', state: 'empty' as const });

export const createEmptyRow = () => ({
  tiles: Array(WORD_LENGTH).fill(null).map(createEmptyTile),
  isComplete: false,
  isActive: false,
});

export const createInitialGameBoard = () => {
  const rows = Array(MAX_GUESSES).fill(null).map(createEmptyRow);
  // Set the first row as active
  rows[0].isActive = true;
  
  return {
    rows,
    currentRowIndex: 0,
    maxAttempts: MAX_GUESSES,
    wordLength: WORD_LENGTH
  };
};

// Create initial game state
export const createInitialGameState = (targetWord?: string) => ({
  gameBoard: createInitialGameBoard(),
  targetWord: targetWord || '',
  isGameOver: false, 
  isGameWon: false,
  guessedWords: [],
  letterStatuses: {} as Record<string, string>
});
