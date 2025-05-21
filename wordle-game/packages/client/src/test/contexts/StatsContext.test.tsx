import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { StatsProvider, useStats } from '../../contexts/StatsContext/StatsContext';
import { GameStatistics } from '../../contexts/StatsContext/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock Date
const FIXED_DATE = new Date('2025-03-15T12:00:00Z');
const NEXT_DATE = new Date('2025-03-16T12:00:00Z');

// Test component that uses the stats context
const TestComponent = () => {
  const { statistics, addGameResult, resetStatistics } = useStats();

  return (
    <div>
      <div data-testid="gamesPlayed">{statistics.gamesPlayed}</div>
      <div data-testid="gamesWon">{statistics.gamesWon}</div>
      <div data-testid="currentStreak">{statistics.currentStreak}</div>
      <div data-testid="maxStreak">{statistics.maxStreak}</div>
      <div data-testid="guessDistribution">{statistics.guessDistribution.join(',')}</div>
      <button data-testid="addWin" onClick={() => addGameResult(true, 3)}>Add Win</button>
      <button data-testid="addLoss" onClick={() => addGameResult(false, 6)}>Add Loss</button>
      <button data-testid="reset" onClick={resetStatistics}>Reset Stats</button>
    </div>
  );
};

describe('StatsContext', () => {
  let originalDate: DateConstructor;

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();

    // Save original Date
    originalDate = global.Date;
    // Mock Date to return fixed date
    global.Date = class extends Date {
      constructor() {
        super();
        return FIXED_DATE;
      }
      static now() {
        return FIXED_DATE.getTime();
      }
    } as DateConstructor;
  });

  afterEach(() => {
    vi.resetAllMocks();
    // Restore original Date
    global.Date = originalDate;
  });

  describe('Initialization', () => {
    it('initializes with default state', () => {
      render(
        <StatsProvider>
          <TestComponent />
        </StatsProvider>
      );

      expect(screen.getByTestId('gamesPlayed')).toHaveTextContent('0');
      expect(screen.getByTestId('gamesWon')).toHaveTextContent('0');
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('0');
      expect(screen.getByTestId('maxStreak')).toHaveTextContent('0');
      expect(screen.getByTestId('guessDistribution')).toHaveTextContent('0,0,0,0,0,0');
    });

    it('loads saved statistics from localStorage', () => {
      // Setup saved stats in localStorage
      const savedStats: GameStatistics = {
        gamesPlayed: 10,
        gamesWon: 8,
        currentStreak: 3,
        maxStreak: 5,
        guessDistribution: [1, 2, 3, 1, 0, 1],
        lastCompletedGameDate: '2025-03-14'
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedStats));

      render(
        <StatsProvider>
          <TestComponent />
        </StatsProvider>
      );

      expect(screen.getByTestId('gamesPlayed')).toHaveTextContent('10');
      expect(screen.getByTestId('gamesWon')).toHaveTextContent('8');
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('3');
      expect(screen.getByTestId('maxStreak')).toHaveTextContent('5');
      expect(screen.getByTestId('guessDistribution')).toHaveTextContent('1,2,3,1,0,1');
    });
  });

  describe('Game Result Updates', () => {
    it('updates statistics correctly after a win', () => {
      render(
        <StatsProvider>
          <TestComponent />
        </StatsProvider>
      );

      fireEvent.click(screen.getByTestId('addWin'));

      expect(screen.getByTestId('gamesPlayed')).toHaveTextContent('1');
      expect(screen.getByTestId('gamesWon')).toHaveTextContent('1');
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('1');
      expect(screen.getByTestId('maxStreak')).toHaveTextContent('1');

      // Check that the 3rd position (index 2) in guess distribution was incremented
      expect(screen.getByTestId('guessDistribution')).toHaveTextContent('0,0,1,0,0,0');
    });

    it('updates statistics correctly after a loss', () => {
      render(
        <StatsProvider>
          <TestComponent />
        </StatsProvider>
      );

      fireEvent.click(screen.getByTestId('addLoss'));

      expect(screen.getByTestId('gamesPlayed')).toHaveTextContent('1');
      expect(screen.getByTestId('gamesWon')).toHaveTextContent('0');
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('0');
      expect(screen.getByTestId('maxStreak')).toHaveTextContent('0');

      // Guess distribution shouldn't change on a loss
      expect(screen.getByTestId('guessDistribution')).toHaveTextContent('0,0,0,0,0,0');
    });

    it('resets current streak after a loss', () => {
      // Setup stats with a streak
      const savedStats: GameStatistics = {
        gamesPlayed: 5,
        gamesWon: 5,
        currentStreak: 5,
        maxStreak: 5,
        guessDistribution: [1, 1, 1, 1, 1, 0],
        lastCompletedGameDate: '2025-03-14'
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedStats));

      render(
        <StatsProvider>
          <TestComponent />
        </StatsProvider>
      );

      // Current streak should be 5
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('5');

      // Add a loss
      fireEvent.click(screen.getByTestId('addLoss'));

      // Current streak should reset to 0, max streak should remain 5
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('0');
      expect(screen.getByTestId('maxStreak')).toHaveTextContent('5');
    });

    it('increments current streak after consecutive wins', () => {
      render(
        <StatsProvider>
          <TestComponent />
        </StatsProvider>
      );

      // First win
      fireEvent.click(screen.getByTestId('addWin'));
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('1');
      expect(screen.getByTestId('maxStreak')).toHaveTextContent('1');

      // Second win
      fireEvent.click(screen.getByTestId('addWin'));
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('2');
      expect(screen.getByTestId('maxStreak')).toHaveTextContent('2');
    });

    it('tracks max streak correctly', () => {
      // Setup stats with existing streak
      const savedStats: GameStatistics = {
        gamesPlayed: 10,
        gamesWon: 7,
        currentStreak: 0, // Currently no streak
        maxStreak: 5, // But had a 5-game streak previously
        guessDistribution: [1, 2, 3, 1, 0, 0],
        lastCompletedGameDate: '2025-03-14'
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedStats));

      render(
        <StatsProvider>
          <TestComponent />
        </StatsProvider>
      );

      // Add 6 consecutive wins to build a new streak
      for (let i = 0; i < 6; i++) {
        fireEvent.click(screen.getByTestId('addWin'));
      }

      // Current streak should be 6, exceeding previous max of 5
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('6');
      expect(screen.getByTestId('maxStreak')).toHaveTextContent('6');
    });
  });

  describe('Reset Functionality', () => {
    it('resets statistics to initial values', () => {
      // Setup stats with existing data
      const savedStats: GameStatistics = {
        gamesPlayed: 10,
        gamesWon: 8,
        currentStreak: 3,
        maxStreak: 5,
        guessDistribution: [1, 2, 3, 1, 0, 1],
        lastCompletedGameDate: '2025-03-14'
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedStats));

      render(
        <StatsProvider>
          <TestComponent />
        </StatsProvider>
      );

      // Verify loaded stats
      expect(screen.getByTestId('gamesPlayed')).toHaveTextContent('10');

      // Reset stats
      fireEvent.click(screen.getByTestId('reset'));

      // Verify reset to initial values
      expect(screen.getByTestId('gamesPlayed')).toHaveTextContent('0');
      expect(screen.getByTestId('gamesWon')).toHaveTextContent('0');
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('0');
      expect(screen.getByTestId('maxStreak')).toHaveTextContent('0');
      expect(screen.getByTestId('guessDistribution')).toHaveTextContent('0,0,0,0,0,0');
    });
  });

  describe('Date-based Streak Logic', () => {
    it('maintains streak for games played on consecutive days', () => {
      // Setup stats with a game completed yesterday
      const savedStats: GameStatistics = {
        gamesPlayed: 1,
        gamesWon: 1,
        currentStreak: 1,
        maxStreak: 1,
        guessDistribution: [1, 0, 0, 0, 0, 0],
        lastCompletedGameDate: '2025-03-14' // Yesterday
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedStats));

      render(
        <StatsProvider>
          <TestComponent />
        </StatsProvider>
      );

      // Add a win for today
      fireEvent.click(screen.getByTestId('addWin'));

      // Streak should continue from 1 to 2
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('2');
    });

    it('does not increment streak for second game on the same day', () => {
      // Setup stats with a game already completed today
      const savedStats: GameStatistics = {
        gamesPlayed: 1,
        gamesWon: 1,
        currentStreak: 1,
        maxStreak: 1,
        guessDistribution: [1, 0, 0, 0, 0, 0],
        lastCompletedGameDate: '2025-03-15' // Today
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedStats));

      render(
        <StatsProvider>
          <TestComponent />
        </StatsProvider>
      );

      // Add another win for today
      fireEvent.click(screen.getByTestId('addWin'));

      // Streak should remain at 1 (not increment for second game same day)
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('1');

      // Games played and won should still increment
      expect(screen.getByTestId('gamesPlayed')).toHaveTextContent('2');
      expect(screen.getByTestId('gamesWon')).toHaveTextContent('2');
    });

    it('breaks streak after missing a day', () => {
      // Setup stats with a game completed two days ago
      const savedStats: GameStatistics = {
        gamesPlayed: 2,
        gamesWon: 2,
        currentStreak: 2,
        maxStreak: 2,
        guessDistribution: [1, 1, 0, 0, 0, 0],
        lastCompletedGameDate: '2025-03-13' // Two days ago
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedStats));

      render(
        <StatsProvider>
          <TestComponent />
        </StatsProvider>
      );

      // Add a win for today
      fireEvent.click(screen.getByTestId('addWin'));

      // Streak should reset to 1 since we missed a day
      expect(screen.getByTestId('currentStreak')).toHaveTextContent('1');
    });
  });

  describe('Local Storage Persistence', () => {
    it('saves statistics to localStorage after changes', () => {
      render(
        <StatsProvider>
          <TestComponent />
        </StatsProvider>
      );

      // Add a win
      fireEvent.click(screen.getByTestId('addWin'));

      // Check that setItem was called
      expect(localStorageMock.setItem).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalledWith('wordleGame_statistics', expect.any(String));

      // Parse the saved data to verify it has the updated statistics
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[localStorageMock.setItem.mock.calls.length - 1][1]);
      expect(savedData.gamesPlayed).toBe(1);
      expect(savedData.gamesWon).toBe(1);
      expect(savedData.currentStreak).toBe(1);
      expect(savedData.guessDistribution[2]).toBe(1); // 3rd guess (index 2)
    });
  });
});
