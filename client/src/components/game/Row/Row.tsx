import { type FC } from 'react';
import Tile from '../Tile';
import { type Tile as TileType } from '../../../types/game';

interface RowProps {
  tiles: TileType[];
  isActive: boolean;
  isComplete: boolean;
  isRevealing?: boolean;
  isInvalidWord?: boolean;
  rowIndex?: number;
  totalRows?: number;
}

/**
 * Row component representing a word guess in the Wordle game
 * Accessible implementation with proper ARIA attributes for screen readers
 */
const Row: FC<RowProps> = ({ 
  tiles, 
  isActive, 
  isComplete, 
  isRevealing = false,
  isInvalidWord = false,
  rowIndex = 1,
  totalRows = 6
}) => {
  // Apply appropriate row classes based on state
  const rowClasses = [
    'row',
    isActive ? 'row-active' : '',
    isComplete ? 'row-complete' : '',
  ].filter(Boolean).join(' ');

  // Create accessible label for the row
  const getRowLabel = () => {
    if (isComplete) {
      const word = tiles.map(tile => tile.letter).join('');
      return `Row ${rowIndex} of ${totalRows}: Completed guess "${word}"`;
    }
    if (isActive) {
      return `Row ${rowIndex} of ${totalRows}: Current guess row`;
    }
    return `Row ${rowIndex} of ${totalRows}: Empty guess row`;
  };
  
  return (
    <div 
      className={rowClasses}
      role="row"
      aria-label={getRowLabel()}
      aria-rowindex={rowIndex}
      aria-live={isActive ? 'polite' : 'off'}
    >
      {tiles.map((tile, tileIndex) => (
        <Tile
          key={tileIndex}
          letter={tile.letter}
          state={tile.state}
          position={tileIndex}
          isRevealing={isRevealing}
          isInvalid={isInvalidWord}
          rowIndex={rowIndex + 1}
          colIndex={tileIndex + 1}
        />
      ))}
    </div>
  );
};

export default Row;
