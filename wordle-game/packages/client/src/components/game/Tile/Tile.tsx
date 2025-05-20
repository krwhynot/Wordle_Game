// Location: packages/client/src/components/game/Tile/Tile.tsx
import React from 'react';
import styles from './Tile.module.scss';

export type TileStatus = 'empty' | 'active' | 'filled' | 'correct' | 'present' | 'absent';

interface TileProps {
  letter?: string;
  status: TileStatus;
  position: number;
  isRevealing?: boolean;
}

const Tile: React.FC<TileProps> = ({
  letter = '',
  status,
  position,
  isRevealing = false
}) => {
  const getStatusClass = () => {
    switch (status) {
      case 'correct':
        return styles.correct;
      case 'present':
        return styles.present;
      case 'absent':
        return styles.absent;
      case 'active':
        return styles.active;
      case 'filled':
        return styles.filled;
      default:
        return styles.empty;
    }
  };

  // Apply animation classes based on status and whether it's revealing
  const animationClass = isRevealing ? styles.revealing : '';

  // Apply pop animation when a letter is typed (active or filled status)
  const popClass = letter && (status === 'active' || status === 'filled') ? styles.pop : '';

  return (
    <div
      className={`${styles.tile} ${getStatusClass()} ${animationClass} ${popClass}`}
      style={{ animationDelay: isRevealing ? `${position * 200}ms` : '0ms' }}
      aria-label={letter
        ? `${letter}${status !== 'empty' ? `, ${status}` : ''}`
        : 'empty tile'
      }
      data-status={status}
    >
      {letter}
    </div>
  );
};

export default Tile;
