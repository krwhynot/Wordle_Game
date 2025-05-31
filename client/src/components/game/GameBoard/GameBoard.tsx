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
 */
const GameBoard: FC<GameBoardProps> = ({ 
  gameBoard, 
  isRevealing = false,
  invalidRowIndex = -1
}) => {
  const { rows, currentRowIndex } = gameBoard;
  
  return (
    <div className="game-board">
      {rows.map((row, rowIndex) => (
        <Row
          key={rowIndex}
          tiles={row.tiles}
          isActive={rowIndex === currentRowIndex}
          isComplete={row.isComplete}
          isRevealing={isRevealing && rowIndex === currentRowIndex - 1}
          isInvalidWord={rowIndex === invalidRowIndex}
        />
      ))}
    </div>
  );
};

export default GameBoard;
