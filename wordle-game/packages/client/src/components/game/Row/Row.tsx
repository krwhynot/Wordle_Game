// Location: packages/client/src/components/game/Row/Row.tsx
import React from 'react';
import Tile, { TileStatus } from '../Tile';
import styles from './Row.module.scss';

// Constants
const WORD_LENGTH = 5;

interface RowProps {
  guess: string;
  isCurrentRow: boolean;
  isRevealing?: boolean;
  evaluation?: Array<TileStatus>;
  isInvalid?: boolean;
}

const Row: React.FC<RowProps> = ({
  guess = '',
  isCurrentRow,
  isRevealing = false,
  evaluation = [],
  isInvalid = false
}) => {
  // Pad the guess to 5 characters
  const paddedGuess = guess.padEnd(WORD_LENGTH, ' ');

  const tiles = Array.from(paddedGuess).map((letter, i) => {
    let status: TileStatus = 'empty';

    // If letter is provided
    if (letter !== ' ') {
      if (evaluation[i]) {
        // Use evaluation if provided (correct, present, absent)
        status = evaluation[i];
      } else {
        status = isCurrentRow ? 'active' : 'filled';
      }
    } else if (isCurrentRow && i === guess.length) {
      // Current active position if it's the current row
      status = 'active';
    }

    return (
      <Tile
        key={i}
        letter={letter !== ' ' ? letter : undefined}
        status={status}
        position={i}
        isRevealing={isRevealing}
      />
    );
  });

  return (
    <div
      className={`${styles.row} ${isInvalid ? styles.invalid : ''}`}
      aria-label={`Row ${isCurrentRow ? 'current' : ''}`}
      role="row"
    >
      {tiles}
    </div>
  );
};

export default Row;
