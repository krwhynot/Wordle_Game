import { useEffect, type FC } from 'react';
import { motion, useAnimation, type AnimationControls } from 'framer-motion';
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

  const tileClass = `tile tile-${state}`;
  return (
    <motion.div
      className={tileClass}
      data-state={state}
      data-position={position}
      initial={false}
      animate={controls}
      variants={variants}
    >
      {letter}
    </motion.div>
  );
};

export default Tile;
