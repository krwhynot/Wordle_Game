/**
 * Game-related types for F&B Wordle
 */

/**
 * Represents the state of a letter tile
 */
export type TileState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

/**
 * Represents a single letter tile with its state
 */
export interface Tile {
  letter: string;
  state: TileState;
}

/**
 * Represents a row of tiles (a word guess)
 */
export interface Row {
  tiles: Tile[];
  isComplete: boolean;
  isActive: boolean;
}

/**
 * Represents the complete game board state
 */
export interface GameBoard {
  rows: Row[];
  currentRowIndex: number;
  maxAttempts: number;
  wordLength: number;
}

/**
 * Represents the state of the entire game
 */
export interface GameState {
  gameBoard: GameBoard;
  targetWord: string;
  isGameOver: boolean;
  isGameWon: boolean;
  guessedWords: string[];
  letterStatuses: Record<string, TileState>;
}
