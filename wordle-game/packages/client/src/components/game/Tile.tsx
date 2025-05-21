// Location: packages/client/src/components/game/Tile/Tile.tsx
import React from 'react';

export type TileStatus = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

export interface TileProps {
  letter?: string;
  status: TileStatus;
  position: number;
  isRevealed?: boolean;
  'aria-label'?: string;
}

const Tile: React.FC<TileProps> = ({
  letter = '',
  status = 'empty',
  position,
  isRevealed = false,
  'aria-label': ariaLabel,
}) => {
  // Implementation details will go here
  return (
    <div
      className={`tile tile-${status} ${isRevealed ? 'revealed' : ''}`}
      aria-label={ariaLabel || `tile ${position + 1}, ${letter}, ${status}`}
      role="gridcell"
    >
      {letter}
    </div>
  );
};

export default Tile;
