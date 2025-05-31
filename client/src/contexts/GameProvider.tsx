import { useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSession } from '../hooks/useSession';
import { GameContext } from './GameContextDefinitions';
import type { GameState, TileState } from '../types/game';
import { validateWord, getDailyWord } from '../services/wordService';
import { saveGameResult } from '../services/statisticsService';

// Create a function to generate the initial empty game state
const createInitialGameState = (targetWord: string = ''): GameState => {
  // Create empty tiles for a row
  const createEmptyTiles = () => Array(5).fill(null).map(() => ({ letter: '', state: 'empty' as TileState }));
  
  // Create rows for the game board
  const createRows = () => {
    const rows = Array(6).fill(null).map(() => ({
      tiles: createEmptyTiles(),
      isComplete: false,
      isActive: false
    }));
    // Set first row as active
    rows[0].isActive = true;
    return rows;
  };

  return {
    gameBoard: {
      rows: createRows(),
      currentRowIndex: 0,
      maxAttempts: 6,
      wordLength: 5
    },
    targetWord,
    isGameOver: false,
    isGameWon: false,
    guessedWords: [],
    letterStatuses: {}
  };
};

interface GameProviderProps {
  children: ReactNode;
}

/**
 * Game provider component that manages game state and logic
 */
export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [isRevealing, setIsRevealing] = useState(false);
  const [invalidRowIndex, setInvalidRowIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { playerName } = useSession();

  // Fetch daily word on component mount
  useEffect(() => {
    fetchDailyWord();
  }, []);

  // Reset error message after delay
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Reset invalid animation after delay
  useEffect(() => {
    if (invalidRowIndex >= 0) {
      const timer = setTimeout(() => {
        setInvalidRowIndex(-1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [invalidRowIndex]);

  /**
   * Fetches the daily word from the API
   */
  const fetchDailyWord = useCallback(async (): Promise<boolean> => {
    try {
      const response = await getDailyWord();
      
      if (response.data?.word) {
        const word = response.data.word.toLowerCase();
        setGameState(prev => ({ ...prev, targetWord: word }));
        return true;
      } else {
        throw new Error('Invalid word received');
      }
    } catch (error) {
      console.error('Failed to fetch daily word:', error);
      setErrorMessage('Could not load game data. Please try again later.');
      return false;
    }
  }, []);

  /**
   * Adds a letter to the current position on the board
   */
  const addLetter = useCallback((letter: string) => {
    if (gameState.isGameOver) return;

    const { gameBoard } = gameState;
    const { currentRowIndex } = gameBoard;
    const currentRow = gameBoard.rows[currentRowIndex];

    // Find the first empty tile in the current row
    const emptyTileIndex = currentRow.tiles.findIndex(tile => tile.letter === '');
    if (emptyTileIndex === -1) return; // Row is full

    // Add the letter to the tile
    const updatedRows = [...gameBoard.rows];
    updatedRows[currentRowIndex] = {
      ...currentRow,
      tiles: currentRow.tiles.map((tile, index) =>
        index === emptyTileIndex ? { ...tile, letter, state: 'filled' } : tile
      ),
    };

    // Update game state
    setGameState({
      ...gameState,
      gameBoard: {
        ...gameBoard,
        rows: updatedRows,
      },
    });
  }, [gameState]);

  /**
   * Removes the last letter from the current row
   */
  const removeLetter = useCallback(() => {
    if (gameState.isGameOver) return;

    const { gameBoard } = gameState;
    const { currentRowIndex } = gameBoard;
    const currentRow = gameBoard.rows[currentRowIndex];

    // Find the last filled tile in the current row (from right to left)
    const filledTiles = currentRow.tiles.filter(tile => tile.letter !== '');
    if (filledTiles.length === 0) return; // No letters to remove

    const lastFilledTileIndex = currentRow.tiles.findIndex((tile, index, array) =>
      tile.letter !== '' && (index === array.length - 1 || array[index + 1].letter === '')
    );

    // Remove the letter from the tile
    const updatedRows = [...gameBoard.rows];
    updatedRows[currentRowIndex] = {
      ...currentRow,
      tiles: currentRow.tiles.map((tile, index) =>
        index === lastFilledTileIndex ? { ...tile, letter: '', state: 'empty' } : tile
      ),
    };

    // Update game state
    setGameState({
      ...gameState,
      gameBoard: {
        ...gameBoard,
        rows: updatedRows,
      },
    });
  }, [gameState]);

  /**
   * Submits the current guess and evaluates it
   */
  const submitGuess = useCallback(async (): Promise<boolean> => {
    if (gameState.isGameOver) return false;

    const { gameBoard, targetWord } = gameState;
    const { currentRowIndex } = gameBoard;
    const currentRow = gameBoard.rows[currentRowIndex];

    // Get the current guess
    const guess = currentRow.tiles.map(tile => tile.letter).join('');

    // Check if the guess is complete
    if (guess.length !== gameBoard.wordLength) {
      setInvalidRowIndex(currentRowIndex);
      setErrorMessage('Not enough letters');
      return false;
    }

    // Validate the word against our F&B dictionary
    const validationResult = await validateWord(guess);

    if (!validationResult.data?.valid) {
      setInvalidRowIndex(currentRowIndex);
      setErrorMessage(validationResult.data?.reason || 'Not a valid word');
      return false;
    }

    // Clear any error message
    setErrorMessage(null);

    // Evaluate the guess
    const targetLetters = targetWord.split('');
    const evaluation: TileState[] = new Array(gameBoard.wordLength).fill('absent');
    const letterOccurrences: Record<string, number> = {};

    // Count occurrences of each letter in the target word
    targetLetters.forEach(letter => {
      letterOccurrences[letter] = (letterOccurrences[letter] || 0) + 1;
    });

    // First pass: check for correct letters
    for (let i = 0; i < gameBoard.wordLength; i++) {
      const guessLetter = guess[i];
      if (guessLetter === targetLetters[i]) {
        evaluation[i] = 'correct';
        letterOccurrences[guessLetter]--;
      }
    }

    // Second pass: check for present letters
    for (let i = 0; i < gameBoard.wordLength; i++) {
      const guessLetter = guess[i];
      if (evaluation[i] !== 'correct' && letterOccurrences[guessLetter] > 0) {
        evaluation[i] = 'present';
        letterOccurrences[guessLetter]--;
      }
    }

    // Create new letterStatuses by adding the new information
    const letterStatuses = { ...gameState.letterStatuses };
    for (let i = 0; i < gameBoard.wordLength; i++) {
      const letter = guess[i];
      const currentStatus = letterStatuses[letter];
      const newStatus = evaluation[i];

      // Only update if the new status is better than the current one
      if (!currentStatus ||
        (currentStatus === 'absent' && (newStatus === 'present' || newStatus === 'correct')) ||
        (currentStatus === 'present' && newStatus === 'correct')) {
        letterStatuses[letter] = newStatus;
      }
    }

    // Update row with evaluation results
    const newRows = [...gameBoard.rows];
    newRows[currentRowIndex] = {
      ...currentRow,
      isComplete: true,
      isActive: false,
      tiles: currentRow.tiles.map((tile, index) => ({
        ...tile,
        state: evaluation[index],
      })),
    };

    // Update the next row to be active, if not game over
    if (currentRowIndex + 1 < gameBoard.maxAttempts) {
      newRows[currentRowIndex + 1].isActive = true;
    }

    // Check if game is won or over
    const isCorrect = evaluation.every(state => state === 'correct');
    const isGameOver = isCorrect || currentRowIndex === gameBoard.maxAttempts - 1;
    
    // Start reveal animation
    setIsRevealing(true);

    // Add guessed word to list
    const guessedWords = [...gameState.guessedWords, guess];

    // Submit result to API if player has a name and game is over
    if (isGameOver && playerName) {
      try {
        // Note: Adapting to match statsService.ts GameResult interface
        await saveGameResult({
          sessionId: crypto.randomUUID(), // Generate a session ID if needed by the API
          playerName,
          targetWord,
          guesses: guessedWords,
          isWin: isCorrect,
          attempts: currentRowIndex + 1,
          date: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Failed to submit game result:', error);
      }
    }

    // Update game state
    setGameState({
      ...gameState,
      gameBoard: {
        ...gameBoard,
        rows: newRows,
        currentRowIndex: isGameOver ? currentRowIndex : currentRowIndex + 1,
      },
      isGameOver,
      isGameWon: isCorrect,
      guessedWords,
      letterStatuses,
    });

    // End reveal animation after delay
    setTimeout(() => {
      setIsRevealing(false);
    }, 1500);
    
    return true;
  }, [gameState, playerName]);

  /**
   * Resets the game with a new target word
   */
  const resetGame = useCallback((newTargetWord?: string) => {
    setGameState(state => createInitialGameState(newTargetWord || state.targetWord));
    setIsRevealing(false);
    setInvalidRowIndex(-1);
    setErrorMessage(null);
  }, []);

  // Context value with all state and methods
  const value = {
    gameState,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
    fetchDailyWord,
    isRevealing,
    invalidRowIndex,
    errorMessage,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
