import type { GameBoard, Row, Tile, GameState } from '../types/game';

// Default values for the game
export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

// Sample target word for development (will be replaced with server-provided word)
export const SAMPLE_TARGET_WORD = 'SAUTE';

/**
 * Creates an empty game board with the default configuration
 * @returns A new empty GameBoard object
 */
export const createEmptyGameBoard = (): GameBoard => {
  const rows: Row[] = [];
  
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const tiles: Tile[] = [];
    
    for (let j = 0; j < WORD_LENGTH; j++) {
      tiles.push({ letter: '', state: 'empty' });
    }
    
    rows.push({
      tiles,
      isActive: i === 0,
      isComplete: false,
    });
  }
  
  return {
    rows,
    currentRowIndex: 0,
    maxAttempts: MAX_ATTEMPTS,
    wordLength: WORD_LENGTH,
  };
};

/**
 * Initial game state - use this as a template for resetting the game
 */
export const createInitialGameState = (targetWord = SAMPLE_TARGET_WORD): GameState => ({
  gameBoard: createEmptyGameBoard(),
  targetWord,
  isGameOver: false,
  isGameWon: false,
  guessedWords: [],
  letterStatuses: {},
});
