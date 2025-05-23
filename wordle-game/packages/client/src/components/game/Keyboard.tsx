// packages/client/src/components/game/Keyboard.tsx
import React from 'react';
import { useGame } from '../../contexts/GameContext/GameContext';

const Keyboard: React.FC = () => {
  const { addLetter, removeLetter, submitGuess, getLetterStatus } = useGame();

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const handleKeyClick = (key: string) => {
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      removeLetter();
    } else {
      addLetter(key);
    }
  };

  return (
    <div className="keyboard" aria-label="Virtual keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const status = getLetterStatus(key) || 'empty';
            const isSpecialKey = key === 'ENTER' || key === 'BACKSPACE';

            return (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`keyboard-key ${status !== 'empty' ? `keyboard-key-${status}` : ''} ${isSpecialKey ? 'keyboard-key-special' : ''}`}
                aria-label={isSpecialKey ? key.toLowerCase() : `key ${key}`}
              >
                {key === 'BACKSPACE' ? '←' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
