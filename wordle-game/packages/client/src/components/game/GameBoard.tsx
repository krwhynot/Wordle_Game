// packages/client/src/components/game/GameBoard.tsx
import React from 'react';
import Row from './Row';
import { TileStatus } from './Tile';
import { useGame } from '../../contexts/GameContext/GameContext';
import { Guess } from 'shared';

const GameBoard: React.FC = () => {
  const { guesses, currentGuess, isRevealing, invalidGuess } = useGame();

  const rows = Array(6).fill('').map((_, i) => {
    let rowLetters: string[] = ['', '', '', '', ''];
    let rowEvaluation: TileStatus[] = Array(5).fill('empty');
    let rowIsRevealed = false;
    let rowIsInvalid = false;

    if (i < guesses.length) {
      // Past guesses
      const guess: Guess = guesses[i];
      rowLetters = guess.word.split('');
      rowEvaluation = guess.evaluation as TileStatus[];
      rowIsRevealed = !isRevealing || i !== guesses.length - 1; // Reveal all but the last guess if revealing
    } else if (i === guesses.length) {
      // Current guess
      rowLetters = currentGuess.split('');
      while (rowLetters.length < 5) rowLetters.push('');
      rowEvaluation = rowLetters.map(letter => (letter ? 'filled' : 'empty')) as TileStatus[];
      rowIsInvalid = invalidGuess.isInvalid && invalidGuess.rowIndex === i;
    }

    return {
      letters: rowLetters,
      evaluation: rowEvaluation,
      isRevealed: rowIsRevealed,
      isInvalid: rowIsInvalid,
      rowIndex: i
    };
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
