import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameStatistics, StatsContextType } from './types';

// Initial statistics state
const initialStats: GameStatistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0], // 6 possible guess counts
};

// Create context with default value
const StatsContext = createContext<StatsContextType | undefined>(undefined);

interface StatsProviderProps {
  children: ReactNode;
}

export const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const [statistics, setStatistics] = useState<GameStatistics>(initialStats);

  // Load statistics from localStorage on mount
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('wordleGame_statistics');
      if (savedStats) {
        setStatistics(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  }, []);

  // Save statistics to localStorage when they change
  useEffect(() => {
    localStorage.setItem('wordleGame_statistics', JSON.stringify(statistics));
  }, [statistics]);

  // Add a game result to statistics
  const addGameResult = (won: boolean, attempts: number) => {
    setStatistics(prevStats => {
      const today = new Date().toISOString().split('T')[0];

      // Check if this is a new day compared to last completed game
      const isNewDay = prevStats.lastCompletedGameDate !== today;

      // Calculate new streak
      let newStreak = prevStats.currentStreak;
      if (won) {
        // Increment streak only if won
        newStreak = isNewDay ? prevStats.currentStreak + 1 : prevStats.currentStreak;
      } else {
        // Reset streak on loss
        newStreak = 0;
      }

      // Update guess distribution if the game was won
      const newDistribution = [...prevStats.guessDistribution];
      if (won && attempts >= 1 && attempts <= 6) {
        newDistribution[attempts - 1] += 1;
      }

      return {
        gamesPlayed: prevStats.gamesPlayed + 1,
        gamesWon: won ? prevStats.gamesWon + 1 : prevStats.gamesWon,
        currentStreak: newStreak,
        maxStreak: Math.max(newStreak, prevStats.maxStreak),
        guessDistribution: newDistribution,
        lastCompletedGameDate: today,
      };
    });
  };

  // Reset statistics
  const resetStatistics = () => {
    setStatistics(initialStats);
  };

  // Context value
  const value: StatsContextType = {
    statistics,
    addGameResult,
    resetStatistics
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
};

// Custom hook to use the stats context
export const useStats = (): StatsContextType => {
  const context = useContext(StatsContext);

  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }

  return context;
};

export default StatsContext;
