// Location: packages/client/src/context/GameContext/GameContext.tsx
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GameContextType, GameState, Guess, EvaluationResult, GameStatus } from 'shared';
import api from '../../services/api';

// Constants
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

// Default solution as fallback if API fails
const DEFAULT_SOLUTION = "react";

// Initial game state
const initialState: GameState = {
  solution: DEFAULT_SOLUTION,
  guesses: [],
  currentGuess: '',
  gameStatus: 'playing',
  isRevealing: false,
  invalidGuess: {
    isInvalid: false,
    rowIndex: -1
  },
  isGameLoaded: false
};

// Action types
type GameAction =
  | { type: 'ADD_LETTER'; payload: string }
  | { type: 'REMOVE_LETTER' }
  | { type: 'SET_CURRENT_GUESS'; payload: string }
  | { type: 'SUBMIT_GUESS'; payload: Guess }
  | { type: 'SET_INVALID_GUESS'; payload: { isInvalid: boolean; rowIndex: number } }
  | { type: 'SET_REVEALING'; payload: boolean }
  | { type: 'SET_GAME_STATUS'; payload: GameStatus }
  | { type: 'LOAD_GAME'; payload: Partial<GameState> }
  | { type: 'RESET_GAME' };

// Reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_LETTER':
      // Only add letter if current guess is less than word length and game is playing
      if (state.currentGuess.length < WORD_LENGTH && state.gameStatus === 'playing') {
        return {
          ...state,
          currentGuess: state.currentGuess + action.payload
        };
      }
      return state;

    case 'REMOVE_LETTER':
      // Remove the last letter from current guess
      return {
        ...state,
        currentGuess: state.currentGuess.slice(0, -1)
      };

    case 'SET_CURRENT_GUESS':
      // Set the current guess directly
      return {
        ...state,
        currentGuess: action.payload
      };

    case 'SUBMIT_GUESS':
      // Add the new guess to the guesses array
      const newGuesses = [...state.guesses, action.payload];

      // Check if the player won or lost
      let newGameStatus: GameStatus = state.gameStatus;

      // Win condition: correct guess
      if (action.payload.word === state.solution) {
        newGameStatus = 'won';
      }
      // Lose condition: used all attempts and still wrong
      else if (newGuesses.length >= MAX_ATTEMPTS) {
        newGameStatus = 'lost';
      }

      return {
        ...state,
        guesses: newGuesses,
        currentGuess: '',
        gameStatus: newGameStatus,
        invalidGuess: { isInvalid: false, rowIndex: -1 },
        isRevealing: true
      };

    case 'SET_INVALID_GUESS':
      // Set invalid guess state
      return {
        ...state,
        invalidGuess: action.payload
      };

    case 'SET_REVEALING':
      // Set revealing state (for animations)
      return {
        ...state,
        isRevealing: action.payload
      };

    case 'SET_GAME_STATUS':
      // Set game status directly
      return {
        ...state,
        gameStatus: action.payload
      };

    case 'LOAD_GAME':
      // Load saved game state
      return {
        ...state,
        ...action.payload,
        isGameLoaded: true
      };

    case 'RESET_GAME':
      // Reset game but keep solution (daily word)
      return {
        ...initialState,
        solution: state.solution,
        isGameLoaded: true
      };

    default:
      return state;
  }
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Props for provider
interface GameProviderProps {
  children: React.ReactNode;
  // Allow overriding the solution for testing
  solution?: string;
}

export const GameProvider: React.FC<GameProviderProps> = ({
  children,
  solution
}) => {
  // Initialize state with either provided solution or to be fetched from API
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialState,
    solution: solution ? solution.toLowerCase() : DEFAULT_SOLUTION
  });

  // Fetch the daily word from the API
  useEffect(() => {
    if (!solution) {
      const fetchDailyWord = async () => {
        try {
          const dailyWord = await api.getDailyWord();
          dispatch({
            type: 'LOAD_GAME',
            payload: { solution: dailyWord.toLowerCase() }
          });
        } catch (error) {
          console.error('Error fetching daily word:', error);
          // Keep the default word if API fails
        }
      };

      fetchDailyWord();
    }
  }, [solution]);

  // Load game from localStorage on mount
  useEffect(() => {
    const loadGame = () => {
      try {
        const savedGame = localStorage.getItem('wordleGame');
        if (savedGame) {
          const parsedGame = JSON.parse(savedGame);
          // Only load if it's today's game (would check date in production)
          if (parsedGame.solution === state.solution) {
            dispatch({ type: 'LOAD_GAME', payload: parsedGame });
          } else {
            // Different solution, start a new game
            localStorage.removeItem('wordleGame');
          }
        }

        // Mark as loaded even if no saved game found
        if (!state.isGameLoaded) {
          dispatch({ type: 'LOAD_GAME', payload: {} });
        }
      } catch (error) {
        console.error('Failed to load game:', error);
        // Mark as loaded even if loading failed
        if (!state.isGameLoaded) {
          dispatch({ type: 'LOAD_GAME', payload: {} });
        }
      }
    };

    loadGame();
  }, [state.solution]);

  // Save game to localStorage when state changes
  useEffect(() => {
    if (state.isGameLoaded) { // Only save after initial load
      localStorage.setItem('wordleGame', JSON.stringify(state));
    }
  }, [state]);

  // Reset revealing state after animation completes
  useEffect(() => {
    if (state.isRevealing) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_REVEALING', payload: false });
      }, 1600); // Slightly longer than the animation duration to ensure completion

      return () => clearTimeout(timer);
    }
  }, [state.isRevealing]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameStatus !== 'playing') return;

      // Key mappings
      if (e.key === 'Backspace') {
        removeLetter();
      } else if (e.key === 'Enter') {
        submitGuess();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        addLetter(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.gameStatus, state.currentGuess]);

  // Add a letter to the current guess
  const addLetter = useCallback((letter: string) => {
    dispatch({ type: 'ADD_LETTER', payload: letter.toUpperCase() });
  }, []);

  // Remove the last letter from the current guess
  const removeLetter = useCallback(() => {
    dispatch({ type: 'REMOVE_LETTER' });
  }, []);

  // Evaluate a guess against the solution
  const evaluateGuess = useCallback((guess: string): EvaluationResult[] => {
    const solution = state.solution.toUpperCase();
    const guessArray = guess.toUpperCase().split('');
    const evaluation: EvaluationResult[] = Array(WORD_LENGTH).fill('absent');

    // Create a map of available letters in the solution
    const solutionMap = solution.split('').reduce<Record<string, number>>((map: Record<string, number>, letter: string) => {
      map[letter] = (map[letter] || 0) + 1;
      return map;
    }, {});

    // First pass: Check for correct positions
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessArray[i] === solution[i]) {
        evaluation[i] = 'correct';
        solutionMap[guessArray[i]]--;
      }
    }

    // Second pass: Check for present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (evaluation[i] !== 'correct' && solutionMap[guessArray[i]] > 0) {
        evaluation[i] = 'present';
        solutionMap[guessArray[i]]--;
      }
    }

    return evaluation;
  }, [state.solution]);

  // Submit the current guess
  const submitGuess = useCallback(async () => {
    // Check if guess is complete and game is still active
    if (state.currentGuess.length !== WORD_LENGTH || state.gameStatus !== 'playing') {
      return;
    }

    // Validate the word against our API
    const isValidWord = await api.validateWord(state.currentGuess);

    if (!isValidWord) {
      dispatch({
        type: 'SET_INVALID_GUESS',
        payload: { isInvalid: true, rowIndex: state.guesses.length }
      });

      // Reset invalid state after shake animation
      setTimeout(() => {
        dispatch({
          type: 'SET_INVALID_GUESS',
          payload: { isInvalid: false, rowIndex: -1 }
        });
      }, 600);

      return;
    }

    // Evaluate the guess
    const evaluation = evaluateGuess(state.currentGuess);

    // Submit the guess
    dispatch({
      type: 'SUBMIT_GUESS',
      payload: {
        word: state.currentGuess,
        evaluation
      }
    });
  }, [state.currentGuess, state.gameStatus, state.guesses.length, evaluateGuess]);

  // Get the status of a specific letter in the keyboard
  const getLetterStatus = useCallback((letter: string): EvaluationResult | undefined => {
    letter = letter.toUpperCase();
    let status: EvaluationResult | undefined;

    // Loop through all guesses to find the best status for this letter
    for (const guess of state.guesses) {
      const guessWord = guess.word.toUpperCase();
      for (let i = 0; i < guessWord.length; i++) {
        if (guessWord[i] === letter) {
          const currentStatus = guess.evaluation[i];

          // Better status precedence: correct > present > absent
          if (currentStatus === 'correct') {
            return 'correct';
          } else if (currentStatus === 'present' && status !== 'correct') {
            status = 'present';
          } else if (currentStatus === 'absent' && !status) {
            status = 'absent';
          }
        }
      }
    }

    return status;
  }, [state.guesses]);

  // Reset the game
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  // Combine state and functions for the context value
  const value: GameContextType = {
    ...state,
    addLetter,
    removeLetter,
    submitGuess,
    getLetterStatus,
    resetGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);

  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }

  return context;
};

export default GameContext;
