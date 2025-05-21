// packages/client/src/components/game/Row.tsx
import React from 'react';
import Tile, { TileStatus } from './Tile';

export interface RowProps {
  letters: string[];
  evaluation?: TileStatus[];
  isRevealed?: boolean;
  rowIndex: number;
}

const Row: React.FC<RowProps> = ({
  letters = ['', '', '', '', ''],
  evaluation = Array(5).fill('empty'),
  isRevealed = false,
  rowIndex,
}) => {
  return (
    <div className="row" role="row">
      {letters.map((letter, i) => (
        <Tile
          key={i}
          letter={letter}
          status={evaluation[i]}
          position={i}
          isRevealed={isRevealed}
          aria-label={`tile ${i + 1}, row ${rowIndex + 1}, ${letter}, ${evaluation[i]}`}
        />
      ))}
    </div>
  );
};

export default Row;
