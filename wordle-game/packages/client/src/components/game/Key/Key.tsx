// Location: packages/client/src/components/game/Key/Key.tsx
import React from 'react';
import { TileStatus } from '../Tile';
import styles from './Key.module.scss';

interface KeyProps {
  value: string;
  onClick: (value: string) => void;
  status?: TileStatus;
  isWide?: boolean;
}

const Key: React.FC<KeyProps> = ({
  value,
  onClick,
  status,
  isWide = false
}) => {
  // Handle special key display
  const displayValue = value === 'ENTER'
    ? 'Enter'
    : value === 'BACKSPACE'
      ? '←'
      : value;

  // Get status class based on status
  const getStatusClass = () => {
    if (!status || status === 'empty' || status === 'active' || status === 'filled') {
      return '';
    }
    return styles[status];
  };

  return (
    <button
      type="button"
      className={`${styles.key} ${getStatusClass()} ${isWide ? styles.wide : ''}`}
      onClick={() => onClick(value)}
      aria-label={value === 'BACKSPACE'
        ? 'Backspace'
        : `Key ${displayValue}`
      }
      data-key={value}
    >
      {displayValue}
    </button>
  );
};

export default Key;
