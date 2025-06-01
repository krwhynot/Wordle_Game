/**
 * Statistics Service Module
 * 
 * Provides comprehensive statistics functionality for the F&B Wordle game:
 * - Tracks game results and player statistics
 * - Manages local storage for offline play
 * - Syncs with backend when available
 * - Handles streak calculations and guess distribution
 */

import { post, get, type ApiResponse } from './api';

// Type definitions for statistics
export interface GameResult {
  sessionId: string;
  playerName: string;
  targetWord: string;
  guesses: string[];
  isWin: boolean;
  attempts: number;
  date: string;
  timeSpentMs?: number;
}

export interface PlayerStatistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  winPercentage: number;
  guessDistribution: number[];
  lastPlayed: string;
  lastCompleted: string;
}

// Default empty stats
export const DEFAULT_STATS: PlayerStatistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  winPercentage: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
  lastPlayed: '',
  lastCompleted: ''
};

// Local storage keys
const STATS_STORAGE_KEY = 'fbwordle_stats';
const LOCAL_RESULTS_KEY = 'fbwordle_game_results';

/**
 * Saves a game result to local storage and syncs with backend if online
 */
export const saveGameResult = async (result: GameResult): Promise<ApiResponse<void>> => {
  try {
    // Save to local storage first for offline access
    const storedResults = getLocalGameResults();
    storedResults.push(result);
    localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify(storedResults));
    
    // Update local stats
    updateLocalStats(result);
    
    // If online, try to sync with backend
    if (navigator.onLine) {
      try {
        return await post<void>('/api/game/results', result);
      } catch (error) {
        console.warn('Failed to sync with backend, using local storage', error);
      }
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
 * Retrieves player statistics, trying the backend first then falling back to local storage
 */
export const getPlayerStatistics = async (sessionId: string): Promise<ApiResponse<PlayerStatistics>> => {
  try {
    // If online, try to get from backend first
    if (navigator.onLine) {
      try {
        const response = await get<PlayerStatistics>(`/api/statistics/${sessionId}`);
        if (response.status === 200 && response.data) {
          // Save remote stats to local storage for offline access
          saveStats(response.data);
          return response;
        }
      } catch (error) {
        console.warn('Could not fetch remote statistics, falling back to local', error);
      }
    }
    
    // Fall back to local calculations
    return { 
      status: 200, 
      data: calculateLocalStatistics()
    };
  } catch (error) {
    console.error('Failed to retrieve player statistics:', error);
    return { 
      status: 200, // Still return local stats even on error
      data: loadStats()
    };
  }
};

/**
 * Gets locally stored game results
 */
const getLocalGameResults = (): GameResult[] => {
  try {
    const savedResults = localStorage.getItem(LOCAL_RESULTS_KEY);
    return savedResults ? JSON.parse(savedResults) as GameResult[] : [];
  } catch (error) {
    console.error('Error loading game results:', error);
    return [];
  }
};

/**
 * Loads player statistics from localStorage
 */
export const loadStats = (): PlayerStatistics => {
  try {
    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
    return savedStats ? JSON.parse(savedStats) as PlayerStatistics : { ...DEFAULT_STATS };
  } catch (error) {
    console.error('Error loading stats:', error);
    return { ...DEFAULT_STATS };
  }
};

/**
 * Saves player statistics to localStorage
 */
const saveStats = (stats: PlayerStatistics): void => {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

/**
 * Updates local statistics based on game result
 */
const updateLocalStats = (result: GameResult): void => {
  const currentStats = loadStats();
  const today = new Date().toISOString().split('T')[0];
  
  const updatedStats: PlayerStatistics = {
    ...currentStats,
    gamesPlayed: currentStats.gamesPlayed + 1,
    lastPlayed: today
  };
  
  // If game was won
  if (result.isWin) {
    updatedStats.gamesWon = currentStats.gamesWon + 1;
    
    // Update streak - increment if last game was yesterday or reset if longer
    const lastPlayed = new Date(currentStats.lastCompleted);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    updatedStats.currentStreak = 
      currentStats.lastCompleted === today ? currentStats.currentStreak : // Same day, keep streak
      currentStats.lastCompleted === yesterday.toISOString().split('T')[0] ? currentStats.currentStreak + 1 : // Next day, increment
      1; // More than one day, reset to 1
      
    updatedStats.maxStreak = Math.max(currentStats.maxStreak, updatedStats.currentStreak);
    updatedStats.lastCompleted = today;
    
    // Update guess distribution (attempts is 1-based, array is 0-based)
    const guessIndex = Math.min(Math.max(0, result.attempts - 1), 5);
    updatedStats.guessDistribution = [...currentStats.guessDistribution];
    updatedStats.guessDistribution[guessIndex] = (currentStats.guessDistribution[guessIndex] || 0) + 1;
  } else {
    // Reset streak on loss
    updatedStats.currentStreak = 0;
  }
  
  // Calculate win percentage
  updatedStats.winPercentage = Math.round((updatedStats.gamesWon / updatedStats.gamesPlayed) * 100);
  
  saveStats(updatedStats);
};

/**
 * Calculates statistics from locally stored game results
 */
const calculateLocalStatistics = (): PlayerStatistics => {
  const results = getLocalGameResults();
  
  if (results.length === 0) {
    return { ...DEFAULT_STATS };
  }
  
  // Sort by date
  const sortedResults = [...results].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Calculate basic stats
  const stats: PlayerStatistics = {
    ...DEFAULT_STATS,
    gamesPlayed: sortedResults.length,
    gamesWon: sortedResults.filter(r => r.isWin).length,
    lastPlayed: sortedResults[sortedResults.length - 1].date,
    lastCompleted: sortedResults.filter(r => r.isWin).pop()?.date || ''
  };
  
  // Calculate win percentage
  stats.winPercentage = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;
  
  // Calculate guess distribution
  const distribution = [0, 0, 0, 0, 0, 0];
  sortedResults
    .filter(r => r.isWin && r.attempts >= 1 && r.attempts <= 6)
    .forEach(r => {
      distribution[r.attempts - 1]++;
    });
  stats.guessDistribution = distribution;
  
  // Calculate streaks
  let currentStreak = 0;
  let maxStreak = 0;
  let lastDate: Date | null = null;
  
  for (const result of sortedResults) {
    const resultDate = new Date(result.date);
    
    if (result.isWin) {
      if (!lastDate || isNextDay(lastDate, resultDate)) {
        currentStreak++;
      } else if (!isSameDay(lastDate, resultDate)) {
        // Reset streak if not consecutive days
        currentStreak = 1;
      }
      
      maxStreak = Math.max(maxStreak, currentStreak);
      lastDate = resultDate;
    } else {
      currentStreak = 0; // Reset streak on loss
    }
  }
  
  stats.currentStreak = currentStreak;
  stats.maxStreak = maxStreak;
  
  return stats;
};

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Helper function to check if date2 is the day after date1
const isNextDay = (date1: Date, date2: Date): boolean => {
  const nextDay = new Date(date1);
  nextDay.setDate(nextDay.getDate() + 1);
  return isSameDay(nextDay, date2);
};

/**
 * Resets all statistics (for testing/development)
 */
export const resetStatistics = (): void => {
  localStorage.removeItem(STATS_STORAGE_KEY);
  localStorage.removeItem(LOCAL_RESULTS_KEY);
};

// Export the default stats for easy importing
export { DEFAULT_STATS as defaultStats };

/**
 * Saves a game result and updates statistics
 */
export const saveGameResult = async (result: GameResult): Promise<void> => {
  try {
    // Update local statistics
    updateLocalStats(result);
    
    // Try to sync with backend (non-blocking)
    await syncGameResult(result).catch(error => {
      console.warn('Failed to sync game result to backend:', error);
    });
  } catch (error) {
    console.error('Error saving game result:', error);
  }
};
