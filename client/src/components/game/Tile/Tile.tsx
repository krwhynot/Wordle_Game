import { useState, useEffect, type FC } from 'react';
import { type TileState } from '../../../types/game';

interface TileProps {
  letter: string;
  state: TileState;
  position: number;
  isRevealing?: boolean;
  isInvalid?: boolean;
}

/**
 * Tile component representing a single letter in the Wordle game
 */
const Tile: FC<TileProps> = ({ 
  letter, 
  state, 
  position, 
  isRevealing = false,
  isInvalid = false
}) => {
  const [animation, setAnimation] = useState<'flip' | 'shake' | 'pop' | null>(null);
  
  // Apply pop animation when letter changes
  useEffect(() => {
    if (letter && state === 'filled') {
      setAnimation('pop');
      const timer = setTimeout(() => {
        setAnimation(null);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [letter, state]);
  
  // Apply flip animation when revealing
  useEffect(() => {
    if (isRevealing) {
      // Stagger animation based on position
      const timer = setTimeout(() => {
        setAnimation('flip');
      }, position * 300);
      
      // Reset animation after it completes
      const resetTimer = setTimeout(() => {
        setAnimation(null);
      }, position * 300 + 500);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(resetTimer);
      };
    }
  }, [isRevealing, position]);
  
  // Apply shake animation for invalid words
  useEffect(() => {
    if (isInvalid) {
      setAnimation('shake');
      const timer = setTimeout(() => {
        setAnimation(null);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [isInvalid]);
  
  // Generate class names based on state and animation
  const tileClasses = [
    'tile',
    `tile-${state}`,
    animation ? animation : '',
  ].filter(Boolean).join(' ');
  
  return (
    <div className={tileClasses} data-state={state} data-position={position}>
      {letter}
    </div>
  );
};

export default Tile;
