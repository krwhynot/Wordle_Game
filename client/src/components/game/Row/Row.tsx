import { type FC } from 'react';
import Tile from '../Tile';
import { type Tile as TileType } from '../../../types/game';

interface RowProps {
  tiles: TileType[];
  isActive: boolean;
  isComplete: boolean;
  isRevealing?: boolean;
  isInvalidWord?: boolean;
}

/**
 * Row component representing a word guess in the Wordle game
 */
const Row: FC<RowProps> = ({ 
  tiles, 
  isActive, 
  isComplete, 
  isRevealing = false,
  isInvalidWord = false
}) => {
  // Apply appropriate row classes based on state
  const rowClasses = [
    'row',
    isActive ? 'row-active' : '',
    isComplete ? 'row-complete' : '',
  ].filter(Boolean).join(' ');
  
  return (
    <div className={rowClasses}>
      {tiles.map((tile, index) => (
        <Tile
          key={index}
          letter={tile.letter}
          state={tile.state}
          position={index}
          isRevealing={isRevealing && isComplete}
          isInvalid={isInvalidWord}
        />
      ))}
    </div>
  );
};

export default Row;
