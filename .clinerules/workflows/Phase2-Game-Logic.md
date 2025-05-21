# Phase 2: Game Logic Implementation - Modified Blueprint

## Overview

This blueprint outlines the implementation plan for Phase 2 of our Azure-integrated Wordle clone, focusing on game logic and state management. It builds upon the existing codebase structure while recommending pragmatic improvements aligned with software engineering best practices.

## Current Implementation Status

The project currently has:
- A single `GameContext.tsx` handling multiple responsibilities (game state, evaluation, keyboard input)
- A separate `ThemeContext.tsx` for theme management
- Basic game state tracking and evaluation algorithm
- Direct embedding of game logic within context rather than separate utilities
- Simple animations defined in SCSS with minimal JS orchestration

## 1. Architectural Principles for Phase 2

### Pragmatic Separation of Concerns
- Incrementally refactor monolithic code into logical units
- Separate game logic from state management where practical
- Create clear boundaries between different functional areas

### Balanced Approach to Refactoring
- Apply the "Boy Scout Rule" - leave code better than you found it
- Focus refactoring efforts on areas with highest technical debt
- Maintain working functionality throughout the refactoring process

### Progressive Enhancement
- Build on existing structures instead of complete rewrites
- Improve type safety and unit testability
- Extract reusable logic for future extension

## 2. Recommended Architecture

### State Management Structure

```
packages/client/src/
├── contexts/               # Context providers
│   ├── GameContext/       # Core game state
│   │   ├── GameContext.tsx  # Main context provider (exists)
│   │   ├── types.ts         # Type definitions
│   │   └── index.ts         # Barrel export file
│   ├── StatsContext/      # Game statistics tracking (new)
│   │   ├── StatsContext.tsx # Statistics provider
│   │   ├── types.ts         # Statistics type definitions
│   │   └── index.ts         # Barrel export file
│   └── ThemeContext.tsx   # Theme management (exists)
├── hooks/                 # Custom hooks
│   ├── useLocalStorage.ts  # Local storage hook (extract from GameContext)
│   └── useKeyHandler.ts    # Keyboard input hook (extract from GameContext)
└── utils/                 # Utility functions
    ├── gameLogic/         # Game-specific utilities
    │   ├── evaluateGuess.ts   # Extracted evaluation algorithm
    │   └── wordValidation.ts  # Word validation utilities
    └── storage/           # Storage utilities
        └── gameStorage.ts     # Game state persistence
```

### Component Architecture

Maintain the existing component architecture while improving their interaction with context:

```
packages/client/src/
└── components/
    ├── game/
    │   ├── GameBoard.tsx    # Game grid (exists)
    │   ├── Keyboard.tsx     # Virtual keyboard (exists)
    │   ├── Row.tsx          # Row of tiles (exists)
    │   ├── Tile.tsx         # Individual tile (exists)
    │   └── Statistics.tsx   # Game statistics component (new)
    └── ui/
        ├── Modal.tsx        # Modal dialog component
        └── Toast.tsx        # Notification component
```

## 3. Implementation Priorities

### 1. Extract Game Logic Utilities
- Refactor the evaluation algorithm into a separate utility
- Create word validation utilities
- Maintain type safety during extraction

### 2. Implement Game Statistics
- Create `StatsContext` for tracking game performance
- Add statistics storage and retrieval
- Develop statistics visualization component

### 3. Enhance Local Storage
- Extract storage logic from GameContext
- Create dedicated persistence utilities
- Ensure proper error handling and fallbacks

### 4. Improve Keyboard Interaction
- Extract keyboard handling logic to a custom hook
- Improve physical and virtual keyboard coordination
- Add accessibility enhancements

### 5. Add Animation Coordination
- Enhance existing CSS animations with JS coordination
- Implement sequenced animations for game events
- Ensure smooth transitions between states

## 4. Implementation Details

### Game Logic Extraction

**1. Extract Evaluation Algorithm**

```typescript
// packages/client/src/utils/gameLogic/evaluateGuess.ts
import { EvaluationResult } from '../../types/game';

/**
 * Evaluates a guess against the solution
 * @param guess - The player's guess (5-letter word)
 * @param solution - The target word to guess
 * @returns Array of evaluation results for each letter
 */
export function evaluateGuess(guess: string, solution: string): EvaluationResult[] {
  // Convert input to uppercase for consistency
  const guessArray = guess.toUpperCase().split('');
  const solutionArray = solution.toUpperCase().split('');

  // Initialize all positions as 'absent'
  const result: EvaluationResult[] = Array(guessArray.length).fill('absent');

  // Track which letters in solution have been matched
  const solutionMap = solutionArray.reduce<Record<string, number>>((map, letter) => {
    map[letter] = (map[letter] || 0) + 1;
    return map;
  }, {});

  // First pass: Find exact matches (correct position)
  for (let i = 0; i < guessArray.length; i++) {
    if (guessArray[i] === solutionArray[i]) {
      result[i] = 'correct';
      solutionMap[guessArray[i]]--;
    }
  }

  // Second pass: Find partial matches (wrong position)
  for (let i = 0; i < guessArray.length; i++) {
    if (result[i] === 'absent' && solutionMap[guessArray[i]] > 0) {
      result[i] = 'present';
      solutionMap[guessArray[i]]--;
    }
  }

  return result;
}
```

**2. Create Word Validation Utility**

```typescript
// packages/client/src/utils/gameLogic/wordValidation.ts

/**
 * Checks if a word is valid for the game
 * @param word - The word to validate
 * @returns Validation result with status and error message if applicable
 */
export function validateWord(word: string): { valid: boolean; error?: string } {
  // Check length
  if (word.length !== 5) {
    return { valid: false, error: 'Word must be 5 letters' };
  }

  // Check if contains only letters
  if (!/^[a-zA-Z]+$/.test(word)) {
    return { valid: false, error: 'Word must contain only letters' };
  }

  // In the future, this would check against a dictionary API
  // For now, consider it valid if it passes basic checks
  return { valid: true };
}

/**
 * In future phases, this function would call the dictionary API
 * For now, it's a placeholder
 */
export async function isInDictionary(word: string): Promise<boolean> {
  // TODO: Implement API call to validate word against dictionary
  // For now, return true if it's a valid word format
  return validateWord(word).valid;
}
```

### Statistics Implementation

**1. Create Statistics Context**

```typescript
// packages/client/src/contexts/StatsContext/types.ts
export interface GameStatistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  // Distribution of guesses for wins (index is attempt number - 1)
  guessDistribution: number[];
  lastCompletedGameDate?: string;
}

export interface StatsContextType {
  statistics: GameStatistics;
  addGameResult: (won: boolean, attempts: number) => void;
  resetStatistics: () => void;
}
```

```typescript
// packages/client/src/contexts/StatsContext/StatsContext.tsx
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
```

**2. Create Statistics Component**

```typescript
// packages/client/src/components/game/Statistics.tsx
import React from 'react';
import { useStats } from '../../contexts/StatsContext';

interface StatisticsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({ isOpen, onClose }) => {
  const { statistics } = useStats();

  if (!isOpen) return null;

  const winPercentage = statistics.gamesPlayed > 0
    ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
    : 0;

  // Find the most frequent guess count (for highlighting)
  const maxGuessCount = Math.max(...statistics.guessDistribution);

  return (
    <div className="statistics-modal">
      <div className="statistics-container">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Statistics</h2>

        <div className="statistics-summary">
          <div className="stat-item">
            <div className="stat-value">{statistics.gamesPlayed}</div>
            <div className="stat-label">Played</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{winPercentage}</div>
            <div className="stat-label">Win %</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics.maxStreak}</div>
            <div className="stat-label">Max Streak</div>
          </div>
        </div>

        <h3>Guess Distribution</h3>
        <div className="guess-distribution">
          {statistics.guessDistribution.map((count, index) => (
            <div className="guess-row" key={index}>
              <div className="guess-label">{index + 1}</div>
              <div
                className={`guess-bar ${count === maxGuessCount && count > 0 ? 'max-value' : ''}`}
                style={{
                  width: count > 0 ? `${Math.max(7, (count / maxGuessCount) * 100)}%` : '7%',
                }}
              >
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
```

### Local Storage Extraction

```typescript
// packages/client/src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: { serialize?: (value: T) => string; deserialize?: (value: string) => T } = {}
): [T, (value: T | ((val: T) => T)) => void] {

  // Custom serialization/deserialization or defaults
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options;

  // Function to get initial value from localStorage or use provided initial value
  const getInitialValue = () => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        return deserialize(storedValue);
      }
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  };

  // State to hold the current value
  const [value, setValue] = useState<T>(getInitialValue);

  // Update localStorage when the state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, serialize(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, serialize, value]);

  return [value, setValue];
}

export default useLocalStorage;
```

### Keyboard Input Extraction

```typescript
// packages/client/src/hooks/useKeyHandler.ts
import { useEffect, useCallback, useState } from 'react';

interface KeyHandlerOptions {
  onKeyDown?: (key: string) => void;
  isEnabled?: boolean;
  allowedKeys?: string[];
}

function useKeyHandler({
  onKeyDown,
  isEnabled = true,
  allowedKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                 'Backspace', 'Enter']
}: KeyHandlerOptions) {
  // Track pressed keys for virtual keyboard synchronization
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  // Handle physical keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isEnabled) return;

    const key = event.key;

    // For letter keys (single character), normalize to uppercase
    if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
      setLastKeyPressed(key.toUpperCase());
      onKeyDown?.(key.toUpperCase());
    }
    // For special keys (Backspace, Enter), pass as is if in allowed keys
    else if (allowedKeys.includes(key)) {
      setLastKeyPressed(key);
      onKeyDown?.(key);
    }
  }, [isEnabled, onKeyDown, allowedKeys]);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Function to handle virtual keyboard presses
  const handleVirtualKeyPress = useCallback((key: string) => {
    if (!isEnabled) return;

    setLastKeyPressed(key);
    onKeyDown?.(key);
  }, [isEnabled, onKeyDown]);

  return {
    lastKeyPressed,
    handleVirtualKeyPress
  };
}

export default useKeyHandler;
```

## 5. Refactoring GameContext

The existing `GameContext.tsx` should be refactored incrementally to:

1. Use the extracted utilities
2. Integrate with StatsContext
3. Simplify responsibilities

Key changes:
- Import and use the `evaluateGuess` utility instead of internal implementation
- Use the `useLocalStorage` hook for state persistence
- Use the `useKeyHandler` hook for keyboard input
- Update the game completion logic to update statistics via StatsContext

## 6. Animation Enhancement

Enhance the existing CSS animations with JavaScript coordination:

```typescript
// packages/client/src/hooks/useAnimationSequence.ts
import { useState, useEffect, useCallback } from 'react';

interface AnimationSequenceOptions {
  duration?: number;
  delay?: number;
  onComplete?: () => void;
}

function useAnimationSequence(steps: number, options: AnimationSequenceOptions = {}) {
  const {
    duration = 1500,
    delay = 0,
    onComplete
  } = options;

  const [currentStep, setCurrentStep] = useState(-1); // -1 means not started
  const [isAnimating, setIsAnimating] = useState(false);

  // Start the animation sequence
  const startSequence = useCallback(() => {
    setIsAnimating(true);
    setCurrentStep(0);
  }, []);

  // Reset the animation sequence
  const resetSequence = useCallback(() => {
    setIsAnimating(false);
    setCurrentStep(-1);
  }, []);

  // Advance through the steps with delays
  useEffect(() => {
    if (!isAnimating) return;

    if (currentStep === -1) {
      // Not started yet, do nothing
      return;
    }

    if (currentStep >= steps) {
      // Sequence complete
      setIsAnimating(false);
      onComplete?.();
      return;
    }

    // Calculate delay for this step (first step gets initial delay, others get staggered)
    const stepDelay = currentStep === 0
      ? delay
      : duration / steps;

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, stepDelay);

    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, steps, duration, delay, onComplete]);

  return {
    currentStep,
    isAnimating,
    startSequence,
    resetSequence
  };
}

export default useAnimationSequence;
```

## 7. Testing Strategy

Implement testing for the game logic components:

1. **Unit Tests for Utilities**:
   - Test `evaluateGuess` with various inputs and edge cases
   - Test `wordValidation` functionality
   - Test storage utilities

2. **Context Testing**:
   - Test `GameContext` state transitions
   - Test `StatsContext` calculation logic

3. **Integration Tests**:
   - Test game completion flow
   - Test statistics updating

## 8. Implementation Steps

1. **Utility Extraction**
   - Create utility files and directories
   - Move game logic to appropriate utilities
   - Update imports and references

2. **Statistics Implementation**
   - Create StatsContext
   - Implement statistics component
   - Connect game completion to statistics
   -
3. **Hook Implementation**
   - Create custom hooks for storage and keyboard
   - Update components to use new hooks

4. **Animation Enhancement**
   - Create animation coordination hook
   - Integrate with existing CSS animations

5. **Testing** 
   - Implement unit tests for core utilities
   - Test context behavior

## 9. Success Criteria

Phase 2 will be considered complete when:

1. Game logic is properly separated into reusable utilities
2. Statistics tracking is fully implemented
3. Keyboard interaction works seamlessly (physical and virtual)
4. Game state is properly persisted in localStorage
5. Animations provide clear feedback for game actions
6. Core functionality is tested with unit tests

## 10. Future Enhancements (Post-Phase 2)

- **Dictionary API Integration**: Connect to backend API for word validation
- **Offline Support**: Add service worker for offline gameplay
- **Extended Statistics**: Add historical statistics and achievements
- **Settings Management**: Allow customizing game behavior

## 11. References

- Existing project implementation in GitHub
- React Context API documentation
- TypeScript best practices
- Software engineering principles from provided documentation
