import { useEffect, type FC } from 'react';
import { motion, useAnimation, type AnimationControls } from 'framer-motion';
import { type TileState } from '../../../types/game';

interface TileProps {
  letter: string;
  state: TileState;
  position: number;
  isRevealing?: boolean;
  isInvalid?: boolean;
  rowIndex?: number;
  colIndex?: number;
}

/**
 * Tile component representing a single letter in the Wordle game
 * Accessible implementation with proper ARIA attributes for screen readers
 */
const Tile: FC<TileProps> = ({ 
  letter, 
  state, 
  position, 
  isRevealing = false,
  isInvalid = false,
  rowIndex = 1,
  colIndex = 1
}) => {
  const controls: AnimationControls = useAnimation();
  const variants = {
    pop: { scale: [1, 1.1, 1], transition: { duration: 0.15 } },
    flip: { rotateX: [0, 180, 0], transition: { duration: 0.5 } },
    shake: { x: [0, -10, 10, -10, 0], transition: { duration: 0.6 } },
  };

  useEffect(() => {
    if (letter && state === 'filled') controls.start('pop');
  }, [letter, state, controls]);
  
  useEffect(() => {
    if (isRevealing) {
      controls.start('flip', { delay: position * 0.3 });
    }
  }, [isRevealing, position, controls]);
  
  useEffect(() => {
    if (isInvalid) controls.start('shake');
  }, [isInvalid, controls]);

  // Generate accessible label based on tile state
  const getAccessibleLabel = () => {
    const positionText = `Row ${rowIndex}, Column ${colIndex}`;
    
    if (!letter) {
      return `${positionText}: Empty`;
    }
    
    switch (state) {
      case 'correct':
        return `${positionText}: ${letter}, Correct position`;
      case 'present':
        return `${positionText}: ${letter}, Wrong position`;
      case 'absent':
        return `${positionText}: ${letter}, Not in word`;
      case 'filled':
        return `${positionText}: ${letter}, Entered`;
      default:
        return `${positionText}: ${letter}`;
    }
  };

  const tileClass = `tile tile-${state}`;
  
  return (
    <motion.div
      className={tileClass}
      data-state={state}
      data-position={position}
      role="gridcell"
      aria-label={getAccessibleLabel()}
      aria-colindex={colIndex}
      aria-live={isRevealing || isInvalid ? 'assertive' : 'polite'}
      tabIndex={-1}
      initial={false}
      animate={controls}
      variants={variants}
    >
      {letter}
    </motion.div>
  );
};

export default Tile;
