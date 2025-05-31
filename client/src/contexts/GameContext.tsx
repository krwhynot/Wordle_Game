import { createContext, useState, useContext, useEffect, type FC, type ReactNode } from 'react';
import { type GameState, type TileState, type Tile, type Row, type GameBoard } from '../types/game';

// Default values for a new game
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

// Default game board state
const createEmptyGameBoard = (): GameBoard => {
  const rows: Row[] = [];
  
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const tiles: Tile[] = [];
    
    for (let j = 0; j < WORD_LENGTH; j++) {
      tiles.push({ letter: '', state: 'empty' });
    }
    
    rows.push({
      tiles,
      isActive: i === 0,
      isComplete: false,
    });
  }
  
  return {
    rows,
    currentRowIndex: 0,
    maxAttempts: MAX_ATTEMPTS,
    wordLength: WORD_LENGTH,
  };
};

// Sample target word for development (will be replaced with server-provided word)
const SAMPLE_TARGET_WORD = 'SAUTE';

// Initial game state
const initialGameState: GameState = {
  gameBoard: createEmptyGameBoard(),
  targetWord: SAMPLE_TARGET_WORD,
  isGameOver: false,
  isGameWon: false,
  guessedWords: [],
  letterStatuses: {},
};

// Create the context
const GameContext = createContext<{
  gameState: GameState;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => Promise<boolean>;
  resetGame: (newTargetWord?: string) => void;
  isRevealing: boolean;
  invalidRowIndex: number;
}>({
  gameState: initialGameState,
  addLetter: () => {},
  removeLetter: () => {},
  submitGuess: async () => false,
  resetGame: () => {},
  isRevealing: false,
  invalidRowIndex: -1,
});

// Provider component
export const GameProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isRevealing, setIsRevealing] = useState(false);
  const [invalidRowIndex, setInvalidRowIndex] = useState(-1);
  
  // Reset any invalid row state after a delay
  useEffect(() => {
    if (invalidRowIndex >= 0) {
      const timer = setTimeout(() => {
        setInvalidRowIndex(-1);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [invalidRowIndex]);
  
  // Add a letter to the current row
  const addLetter = (letter: string) => {
    if (gameState.isGameOver) return;
    
    const { gameBoard } = gameState;
    const { currentRowIndex, wordLength } = gameBoard;
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
    const { currentRowIndex, wordLength } = gameBoard;
    const currentRow = gameBoard.rows[currentRowIndex];
    
    // Get the current guess
    const guess = currentRow.tiles.map(tile => tile.letter).join('');
    
    // Check if the guess is complete
    if (guess.length !== wordLength) {
      setInvalidRowIndex(currentRowIndex);
      return false;
    }
    
    // TODO: Validate against dictionary of valid words
    // For now, we'll just allow any 5-letter guess
    
    // Evaluate the guess
    const targetLetters = targetWord.split('');
    const evaluation: TileState[] = new Array(wordLength).fill('absent');
    const letterOccurrences: Record<string, number> = {};
    
    // Count occurrences of each letter in the target word
    targetLetters.forEach(letter => {
      letterOccurrences[letter] = (letterOccurrences[letter] || 0) + 1;
    });
    
    // First pass: check for correct letters
    for (let i = 0; i < wordLength; i++) {
      const guessLetter = guess[i];
      if (guessLetter === targetLetters[i]) {
        evaluation[i] = 'correct';
        letterOccurrences[guessLetter]--;
      }
    }
    
    // Second pass: check for present letters
    for (let i = 0; i < wordLength; i++) {
      const guessLetter = guess[i];
      if (evaluation[i] !== 'correct' && letterOccurrences[guessLetter] > 0) {
        evaluation[i] = 'present';
        letterOccurrences[guessLetter]--;
      }
    }
    
    // Update letter statuses
    const newLetterStatuses = { ...gameState.letterStatuses };
    
    for (let i = 0; i < wordLength; i++) {
      const letter = guess[i];
      const currentStatus = newLetterStatuses[letter];
      const newStatus = evaluation[i];
      
      // Only update if the new status is better than the current one
      if (!currentStatus || 
          (currentStatus === 'absent' && (newStatus === 'present' || newStatus === 'correct')) ||
          (currentStatus === 'present' && newStatus === 'correct')) {
        newLetterStatuses[letter] = newStatus;
      }
    }
    
    // Update row with evaluation results
    const updatedRows = [...gameBoard.rows];
    updatedRows[currentRowIndex] = {
      ...currentRow,
      isComplete: true,
      isActive: false,
      tiles: currentRow.tiles.map((tile, index) => ({
        ...tile,
        state: evaluation[index],
      })),
    };
    
    // Check if the next row should be active
    if (currentRowIndex < gameBoard.maxAttempts - 1) {
      updatedRows[currentRowIndex + 1].isActive = true;
    }
    
    // Trigger reveal animation
    setIsRevealing(true);
    
    // Update game state
    const isGameWon = guess === targetWord;
    const isGameOver = isGameWon || currentRowIndex === gameBoard.maxAttempts - 1;
    
    setGameState({
      ...gameState,
      gameBoard: {
        ...gameBoard,
        rows: updatedRows,
        currentRowIndex: isGameOver ? currentRowIndex : currentRowIndex + 1,
      },
      guessedWords: [...gameState.guessedWords, guess],
      letterStatuses: newLetterStatuses,
      isGameOver,
      isGameWon,
    });
    
    // Reset revealing state after animation
    setTimeout(() => {
      setIsRevealing(false);
    }, 1600);
    
    return true;
  };
  
  // Reset the game with a new target word
  const resetGame = (newTargetWord: string = SAMPLE_TARGET_WORD) => {
    setGameState({
      ...initialGameState,
      targetWord: newTargetWord,
    });
    setIsRevealing(false);
    setInvalidRowIndex(-1);
  };
  
  return (
    <GameContext.Provider
      value={{
        gameState,
        addLetter,
        removeLetter,
        submitGuess,
        resetGame,
        isRevealing,
        invalidRowIndex,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using the game context
export const useGame = () => useContext(GameContext);

export default GameContext;
