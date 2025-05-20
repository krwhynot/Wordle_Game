// Location: packages/client/src/components/game/Keyboard/Keyboard.tsx
import React from 'react';
import Key from '../Key';
import { useGame } from '../../../context/GameContext';
import styles from './Keyboard.module.scss';

// Keyboard layout
const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

const Keyboard: React.FC = () => {
  const { addLetter, removeLetter, submitGuess, getLetterStatus, gameStatus } = useGame();

  const handleKeyClick = (value: string) => {
    // Don't process input if game is over
    if (gameStatus !== 'playing') return;

    if (value === 'ENTER') {
      submitGuess();
    } else if (value === 'BACKSPACE') {
      removeLetter();
    } else {
      addLetter(value);
    }
  };

  return (
    <div className={styles.keyboard}>
      {KEYS.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((key) => (
            <Key
              key={key}
              value={key}
              onClick={handleKeyClick}
              status={getLetterStatus(key)}
              isWide={key === 'ENTER' || key === 'BACKSPACE'}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
