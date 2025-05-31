/**
 * Storage utilities for F&B Wordle
 * 
 * Provides functions for managing browser storage (localStorage)
 * for game state, user preferences, and statistics.
 */

// Storage keys
export const STORAGE_KEYS = {
  GAME_STATE: 'fb-wordle-game-state',
  STATISTICS: 'fb-wordle-statistics',
  THEME: 'fb-wordle-theme',
  SETTINGS: 'fb-wordle-settings',
  SESSION_ID: 'fb-wordle-session-id',
  LAST_PLAYED: 'fb-wordle-last-played'
};

/**
 * Generates a unique session ID for the player
 * 
 * @returns A unique session identifier
 */
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Gets or creates a session ID for the current player
 * 
 * @returns The player's session ID
 */
export function getOrCreateSessionId(): string {
  const existingId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  
  if (existingId) {
    return existingId;
  }
  
  const newId = generateSessionId();
  localStorage.setItem(STORAGE_KEYS.SESSION_ID, newId);
  return newId;
}

/**
 * Saves data to localStorage with the given key
 * 
 * @param key - Storage key
 * @param data - Data to store
 */
export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
}

/**
 * Retrieves data from localStorage for the given key
 * 
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns The stored data or defaultValue
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Removes data from localStorage for the given key
 * 
 * @param key - Storage key to remove
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

/**
 * Clears all game-related data from localStorage
 * Preserves theme and settings
 */
export function clearGameData(): void {
  try {
    removeFromStorage(STORAGE_KEYS.GAME_STATE);
    removeFromStorage(STORAGE_KEYS.LAST_PLAYED);
  } catch (error) {
    console.error('Error clearing game data:', error);
  }
}

export default {
  STORAGE_KEYS,
  generateSessionId,
  getOrCreateSessionId,
  saveToStorage,
  getFromStorage,
  removeFromStorage,
  clearGameData
};
