import { useState, useEffect, useCallback, type FC, type ReactNode } from 'react';
import { useSession } from '../hooks/useSession';
import type { GameState, TileState } from '../types/game';
import { GameContext } from './GameContextDefinitions';
import { createInitialGameState } from '../utils/gameHelpers';
import { validateWord, getDailyWord } from '../services/wordService';
import { submitGameResult, type GameResult } from '../services/statsService';

// Provider component
export const GameProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [isRevealing, setIsRevealing] = useState(false);
  const [invalidRowIndex, setInvalidRowIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addWordPlayed, playerName, sessionId } = useSession();

  // Reset any invalid row state after a delay
  useEffect(() => {
    if (invalidRowIndex >= 0) {
      const timer = setTimeout(() => {
        setInvalidRowIndex(-1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [invalidRowIndex]);

  // Reset the game with a new target word
  const resetGame = useCallback((newTargetWord?: string) => {
    setGameState(createInitialGameState(newTargetWord));
    setIsRevealing(false);
    setInvalidRowIndex(-1);
    setErrorMessage(null);
  }, []);

  // Fetch the daily word from the API
  const fetchDailyWord = useCallback(async () => {
    try {
      const response = await getDailyWord();

      if (response.status === 200 && response.data?.word) {
        // Initialize game with the fetched word
        resetGame(response.data.word);
        return true;
      } else {
        console.error('Failed to fetch daily word:', response.error);
        // Fall back to default word if API fails
        resetGame();
        return false;
      }
    } catch (error) {
      console.error('Error fetching daily word:', error);
      // Fall back to default word if API fails
      resetGame();
      return false;
    }
  }, [resetGame]);

  // Initialize the board and fetch daily word
  useEffect(() => {
    fetchDailyWord().catch(error => {
      console.error('Error in fetchDailyWord:', error);
    });
  }, [fetchDailyWord]);

  // Add a letter to the current row
  const addLetter = (letter: string) => {
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
  };

  // Remove the last letter from the current row
  const removeLetter = () => {
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
  };

  // Submit the current guess for evaluation
  const submitGuess = async (): Promise<boolean> => {
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

    // Update game over state if last row or correct guess
    const isGameOver = guess === targetWord || currentRowIndex + 1 >= gameBoard.maxAttempts;
    const isGameWon = guess === targetWord;

    // Update the game state with the new board and game over state
    setGameState(prev => ({
      ...prev,
      gameBoard: {
        ...gameBoard,
        rows: newRows,
        currentRowIndex: currentRowIndex + 1,
      },
      letterStatuses,
      isGameOver,
      isGameWon,
      guessedWords: [...prev.guessedWords, guess],
    }));

    // Add to session's played words
    addWordPlayed(guess);

    // If game is now over (won or lost), submit results
    if (isGameWon || currentRowIndex + 1 >= gameBoard.maxAttempts) {
      const gameResult: GameResult = {
        sessionId: sessionId || 'anonymous',
        playerName: playerName || 'Anonymous',
        targetWord,
        guesses: [...gameState.guessedWords, guess],
        isWin: isGameWon,
        attempts: currentRowIndex + 1,
        date: new Date().toISOString()
      };
      
      // Submit result asynchronously - don't wait for it
      submitGameResult(gameResult).catch(err => {
        console.error('Failed to submit game result:', err);
      });
    }
    
    // Reset revealing state after animation
    setTimeout(() => {
      setIsRevealing(false);
    }, 1600);
    
    return true;
  };
  
  // (These functions were moved above for proper dependency handling)
  
  return (
    <GameContext.Provider value={{
      gameState,
      addLetter,
      removeLetter,
      submitGuess,
      resetGame,
      isRevealing,
      invalidRowIndex,
      errorMessage,
      fetchDailyWord
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Export the context for the provider
export { GameContext };
