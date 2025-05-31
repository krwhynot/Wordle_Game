/**
 * Statistics Service Module
 * 
 * Provides functionality for tracking and managing player statistics:
 * - Games played
 * - Win/loss records
 * - Guess distribution
 * - Streaks
 */
import { post, type ApiResponse } from './api';

// Type definitions for statistics
export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  winPercentage: number;
  guessDistribution: number[];
  lastPlayed: string;
  lastCompleted: string;
}

export interface GameResult {
  sessionId: string;
  playerName: string;
  targetWord: string;
  guesses: string[];
  isWin: boolean;
  attempts: number;
  date: string;
}

// Default empty stats
export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  winPercentage: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
  lastPlayed: '',
  lastCompleted: ''
};

// Local storage key for stats
const STATS_STORAGE_KEY = 'wordle_stats';

/**
 * Loads player statistics from localStorage
 * 
 * @returns The player's statistics
 */
export const loadStats = (): GameStats => {
  try {
    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
    return savedStats ? JSON.parse(savedStats) as GameStats : DEFAULT_STATS;
  } catch (error) {
    console.error('Error loading stats:', error);
    return DEFAULT_STATS;
  }
};

/**
 * Saves player statistics to localStorage
 * 
 * @param stats - The statistics to save
 */
export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

/**
 * Updates statistics based on game result
 * 
 * @param result - The game result
 * @returns Updated statistics
 */
export const updateStats = (result: GameResult): GameStats => {
  const currentStats = loadStats();
  const today = new Date().toISOString().split('T')[0];
  
  // Update games played and last played
  const updatedStats: GameStats = {
    ...currentStats,
    gamesPlayed: currentStats.gamesPlayed + 1,
    lastPlayed: today
  };
  
  // If game was won
  if (result.isWin) {
    updatedStats.gamesWon = currentStats.gamesWon + 1;
    updatedStats.currentStreak = currentStats.currentStreak + 1;
    updatedStats.maxStreak = Math.max(currentStats.maxStreak, updatedStats.currentStreak);
    updatedStats.lastCompleted = today;
    
    // Update guess distribution (attempts is 1-based, array is 0-based)
    const attemptIndex = result.attempts - 1;
    if (attemptIndex >= 0 && attemptIndex < updatedStats.guessDistribution.length) {
      updatedStats.guessDistribution[attemptIndex]++;
    }
  } else {
    // Reset streak on loss
    updatedStats.currentStreak = 0;
  }
  
  // Recalculate win percentage
  updatedStats.winPercentage = Math.round(
    (updatedStats.gamesWon / updatedStats.gamesPlayed) * 100
  );
  
  // Save updated stats
  saveStats(updatedStats);
  
  return updatedStats;
};

/**
 * Submits game result to the API
 * 
 * @param result - The game result to submit
 * @returns Promise with the API response
 */
export const submitGameResult = async (
  result: GameResult
): Promise<ApiResponse<{success: boolean}>> => {
  try {
    // For mock API, just return success
    if (import.meta.env.VITE_APP_ENABLE_MOCK_API === 'true') {
      // Still update local stats
      updateStats(result);
      
      return {
        data: { success: true },
        status: 200
      };
    }
    
    // Real API call
    const response = await post<{success: boolean}>('submitResult', result);
    
    // Still update local stats on success
    if (response.status === 200 && response.data?.success) {
      updateStats(result);
    }
    
    return response;
  } catch (error) {
    console.error('Error submitting game result:', error);
    return {
      error: 'Failed to submit game result',
      status: 500
    };
  }
};
