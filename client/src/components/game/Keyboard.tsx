import { useGame } from '../../contexts/GameContext';
import type { TileState } from '../../types/game';
// Styles are included via global.scss keyboard partial

const rows: string[][] = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Enter','Z','X','C','V','B','N','M','Backspace'],
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
              if (key === 'Enter') submitGuess();
              else if (key === 'Backspace') removeLetter();
              else addLetter(key);
            };
            return (
              <button
                key={key}
                className={`key key-${state}`}
                onClick={handleClick}
                aria-label={key}
              >
                {key === 'Backspace' ? '←' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
