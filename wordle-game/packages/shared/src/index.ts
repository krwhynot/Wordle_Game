// This file exports all shared types and interfaces

// Possible game statuses
export type GameStatus = 'playing' | 'won' | 'lost';

// Tile evaluation results - matches our TileStatus from the Tile component
export type EvaluationResult = 'correct' | 'present' | 'absent';

// Represents a single guess and its evaluation
export interface Guess {
  word: string;
  evaluation: EvaluationResult[];
}

// Game state interface
export interface GameState {
  // The solution word (today's word)
  solution: string;

  // All guesses made so far
  guesses: Guess[];

  // Current guess being typed
  currentGuess: string;

  // Game status
  gameStatus: GameStatus;

  // Whether tiles are currently being revealed
  isRevealing: boolean;

  // Track invalid guess state and index
  invalidGuess: {
    isInvalid: boolean;
    rowIndex: number;
  };

  // Whether the game has been loaded from storage
  isGameLoaded: boolean;
}

// Game context interface
export interface GameContextType extends GameState {
  // Add a letter to the current guess
  addLetter: (letter: string) => void;

  // Remove the last letter from the current guess
  removeLetter: () => void;

  // Submit the current guess
  submitGuess: () => Promise<void>;

  // Get status for a letter in the keyboard
  getLetterStatus: (letter: string) => EvaluationResult | undefined;

  // Reset the game
  resetGame: () => void;
}
