import { useState, useEffect, type ReactNode } from 'react';
import { SessionContext } from './SessionContextDefinitions';

/**
 * Props for the SessionProvider component
 */
interface SessionProviderProps {
  children: ReactNode;
}

/**
 * Session provider component that manages player session information
 * such as username, session ID, and word history
 */
export const SessionProvider = ({ children }: SessionProviderProps) => {
  // Initialize player name from localStorage if available
  const [playerName, setPlayerName] = useState<string>(() => {
    const savedName = localStorage.getItem('playerName');
    return savedName || '';
  });

  // Generate a session ID if not already present
  const [sessionId] = useState<string>(() => {
    const savedSessionId = localStorage.getItem('sessionId');
    if (savedSessionId) {
      return savedSessionId;
    }
    
    const newSessionId = crypto.randomUUID();
    localStorage.setItem('sessionId', newSessionId);
    return newSessionId;
  });
  
  // Track words played in this session
  const [wordsPlayed, setWordsPlayed] = useState<string[]>(() => {
    try {
      const savedWords = localStorage.getItem('wordsPlayed');
      return savedWords ? JSON.parse(savedWords) : [];
    } catch (error) {
      console.error('Failed to parse wordsPlayed from localStorage:', error);
      return [];
    }
  });
  
  // Track session start time
  const [startTime, setStartTime] = useState<Date>(() => {
    const savedStartTime = localStorage.getItem('sessionStartTime');
    return savedStartTime ? new Date(savedStartTime) : new Date();
  });
  
  // Save player data to localStorage when it changes
  useEffect(() => {
    if (playerName) {
      localStorage.setItem('playerName', playerName);
    }
    localStorage.setItem('wordsPlayed', JSON.stringify(wordsPlayed));
    localStorage.setItem('sessionStartTime', startTime.toISOString());
  }, [playerName, wordsPlayed, startTime]);
  
  // Function to add a played word to the session
  const addWordPlayed = (word: string) => {
    if (!wordsPlayed.includes(word)) {
      setWordsPlayed(prev => [...prev, word]);
    }
  };
  
  // Function to reset the session
  const resetSession = () => {
    setWordsPlayed([]);
    setStartTime(new Date());
    // Keep the player name and session ID
  };

  return (
    <SessionContext.Provider value={{
      playerName,
      sessionId,
      wordsPlayed,
      startTime,
      setPlayerName,
      addWordPlayed,
      resetSession
    }}>
      {children}
    </SessionContext.Provider>
  );
};
