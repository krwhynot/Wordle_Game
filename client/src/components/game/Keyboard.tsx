import { useGame } from '../../hooks/useGame';
import type { TileState } from '../../types/game';
import './Keyboard.scss';
// Main keyboard styling is in styles/_keyboard.scss, component-specific overrides here

const rows: string[][] = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

const Keyboard = () => {
  const { gameState, addLetter, removeLetter, submitGuess } = useGame();
  const { letterStatuses } = gameState;

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const state = (letterStatuses[key] as TileState) || 'empty';
            const handleClick = () => {
              if (key === 'ENTER') {
                submitGuess();
              } else if (key === '⌫') {
                removeLetter();
              } else {
                addLetter(key);
              }
            };
            return (
              <button
                key={key}
                className={`key key-${state} ${(key === 'ENTER' || key === '⌫') ? 'large' : ''}`}
                onClick={handleClick}
                aria-label={key === '⌫' ? 'Backspace' : key}
                data-testid={`key-${key === '⌫' ? 'backspace' : key.toLowerCase()}`}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
