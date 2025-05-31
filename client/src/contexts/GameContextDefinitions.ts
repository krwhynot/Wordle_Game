import { createContext } from 'react';
import type { GameState } from '../types/game';

// Game context interface with state and methods
export interface GameContextType {
  gameState: GameState;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => Promise<boolean>;
  resetGame: (newTargetWord?: string) => void;
  fetchDailyWord: () => Promise<boolean>;
  isRevealing: boolean;
  invalidRowIndex: number;
  errorMessage: string | null;
}

// Create the context with empty object as initial value
export const GameContext = createContext<GameContextType>({} as GameContextType);
