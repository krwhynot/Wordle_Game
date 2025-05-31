import { type FC } from 'react';
import Row from '../Row';
import { type GameBoard as GameBoardType } from '../../../types/game';

interface GameBoardProps {
  gameBoard: GameBoardType;
  isRevealing?: boolean;
  invalidRowIndex?: number;
}

/**
 * GameBoard component that displays the entire game grid
 * Accessible implementation with proper ARIA attributes and keyboard navigation
 */
const GameBoard: FC<GameBoardProps> = ({ 
  gameBoard, 
  isRevealing = false,
  invalidRowIndex = -1
}) => {
  const { rows, currentRowIndex } = gameBoard;
  const totalGuesses = rows.length;
  const completedGuesses = rows.filter(row => row.isComplete).length;
  
  return (
    <div 
      className="game-board"
      role="grid"
      aria-label={`Wordle game board with ${totalGuesses} rows. Currently on guess ${currentRowIndex + 1} of ${totalGuesses}. ${completedGuesses} guesses completed.`}
      aria-live="polite"
      aria-atomic="false"
    >
      {rows.map((row, rowIndex) => (
        <Row
          key={rowIndex}
          tiles={row.tiles}
          isActive={rowIndex === currentRowIndex}
          isComplete={row.isComplete}
          isRevealing={isRevealing && rowIndex === currentRowIndex - 1}
          isInvalidWord={rowIndex === invalidRowIndex}
          rowIndex={rowIndex + 1}
          totalRows={totalGuesses}
        />
      ))}
    </div>
  );
};

export default GameBoard;
