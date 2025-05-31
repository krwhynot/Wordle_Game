/**
 * Statistics Service Module
 * 
 * Provides API services for game statistics functionality:
 * - Saving game results
 * - Retrieving player statistics
 * - Calculating streaks and averages
 */
import { post, get, type ApiResponse } from './api';

// Type definitions for statistics
export interface GameResult {
  sessionId: string;
  word: string;
  guesses: number;
  success: boolean;
  date: string;
  timeSpentMs: number;
}

export interface PlayerStatistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  averageGuesses: number;
  guessDistribution: Record<number, number>;
  lastPlayed: string | null;
}

// Constants for local storage
const STATISTICS_STORAGE_KEY = 'fbwordle_statistics';

/**
 * Saves a game result to the backend
 * 
 * @param result - The game result to save
 * @returns Promise with the API response
 */
export const saveGameResult = async (result: GameResult): Promise<ApiResponse<void>> => {
  try {
    // For offline play, save to local storage first
    const storedResults = getLocalGameResults();
    storedResults.push(result);
    localStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(storedResults));
    
    // If online, send to the backend
    if (navigator.onLine) {
      return await post<void>('/statistics/save', result);
    }
    
    return { status: 200 };
  } catch (error) {
    console.error('Failed to save game result:', error);
    return { 
      status: 500, 
      error: 'Failed to save game result' 
    };
  }
};

/**
 * Retrieves player statistics from local storage and backend
 * 
 * @param sessionId - Player's session ID
 * @returns Promise with player statistics
 */
export const getPlayerStatistics = async (sessionId: string): Promise<ApiResponse<PlayerStatistics>> => {
  try {
    // If online, try to get from backend first
    if (navigator.onLine) {
      try {
        const response = await get<PlayerStatistics>(`/statistics/${sessionId}`);
        if (response.status === 200 && response.data) {
          // Save remote stats to local storage for offline access
          localStorage.setItem(STATISTICS_STORAGE_KEY + '_calculated', JSON.stringify(response.data));
          return response;
        }
      } catch (error) {
        console.warn('Could not fetch remote statistics, falling back to local', error);
      }
    }
    
    // Fall back to local calculations
    return { 
      status: 200, 
      data: calculateStatistics(getLocalGameResults(), sessionId)
    };
  } catch (error) {
    console.error('Failed to retrieve player statistics:', error);
    return { 
      status: 500, 
      error: 'Failed to retrieve player statistics'
    };
  }
};

/**
 * Gets locally stored game results
 * 
 * @returns Array of game results from local storage
 */
const getLocalGameResults = (): GameResult[] => {
  try {
    const stored = localStorage.getItem(STATISTICS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Calculates player statistics from game results
 * 
 * @param results - Array of game results
 * @param sessionId - Player's session ID
 * @returns Calculated player statistics
 */
const calculateStatistics = (results: GameResult[], sessionId: string): PlayerStatistics => {
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
};

/**
 * Formats game result for sharing
 * 
 * @param result - The game result to format
 * @returns Formatted text for sharing
 */
export const formatShareableResult = (result: GameResult): string => {
  const date = new Date(result.date);
  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  
  let shareText = `F&B Wordle ${dateString} - ${result.success ? result.guesses : 'X'}/6\n\n`;
  
  // In a real implementation, we would add the emoji pattern of the game
  // For now, return a placeholder pattern
  if (result.success) {
    shareText += Array(result.guesses).fill('🟩').join('') + '\n';
  } else {
    shareText += '❌\n';
  }
  
  return shareText;
};
