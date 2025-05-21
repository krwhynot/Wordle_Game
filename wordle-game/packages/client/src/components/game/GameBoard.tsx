// packages/client/src/components/game/GameBoard.tsx
import React from 'react';
import Row from './Row';
import { TileStatus } from './Tile';

export interface GameBoardProps {
  guesses: string[];
  evaluations: TileStatus[][];
  currentRow: number;
  currentGuess: string;
}

const GameBoard: React.FC<GameBoardProps> = ({
  guesses = [],
  evaluations = [],
  currentRow = 0,
  currentGuess = '',
}) => {
  // Create a complete rows array for rendering
  const rows = Array(6).fill('').map((_, i) => {
    // For the current row, show the current guess
    if (i === currentRow) {
      const letters = currentGuess.split('');
      while (letters.length < 5) letters.push('');

      const evaluation = letters.map(letter =>
        letter ? 'filled' : 'empty'
      ) as TileStatus[];

      return { letters, evaluation, isRevealed: false };
    }
    // For past rows, show the submitted guess and evaluation
    else if (i < currentRow && guesses[i]) {
      return {
        letters: guesses[i].split(''),
        evaluation: evaluations[i] || Array(5).fill('empty'),
        isRevealed: true
      };
    }
    // For future rows, show empty tiles
    else {
      return {
        letters: ['', '', '', '', ''],
        evaluation: Array(5).fill('empty'),
        isRevealed: false
      };
    }
  });

  return (
    <div className="game-board" role="grid" aria-label="Wordle game board">
      {rows.map((row, i) => (
        <Row
          key={i}
          letters={row.letters}
          evaluation={row.evaluation}
          isRevealed={row.isRevealed}
          rowIndex={i}
        />
      ))}
    </div>
  );
};

export default GameBoard;
