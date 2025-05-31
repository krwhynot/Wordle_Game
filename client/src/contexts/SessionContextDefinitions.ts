import { createContext } from 'react';

// Session data for player tracking
export interface Session {
  playerName: string;
  sessionId: string;
  wordsPlayed: string[];
  startTime: Date;
}

// Session context interface with state and setters
export interface SessionContextType {
  playerName: string;
  sessionId: string;
  wordsPlayed: string[];
  startTime: Date;
  setPlayerName: (name: string) => void;
  addWordPlayed: (word: string) => void;
  resetSession: () => void;
}

// Create the context with null as initial value
export const SessionContext = createContext<SessionContextType | null>(null);
