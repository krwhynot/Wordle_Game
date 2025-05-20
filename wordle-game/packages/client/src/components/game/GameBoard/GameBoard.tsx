// Location: packages/client/src/components/game/GameBoard/GameBoard.tsx
import React from 'react';
import Row from '../Row';
import { useGame } from '../../../context/GameContext';
import styles from './GameBoard.module.scss';

// Constants
const MAX_ATTEMPTS = 6;

const GameBoard: React.FC = () => {
  const {
    guesses,
    currentGuess,
    isRevealing,
    invalidGuess,
    gameStatus
  } = useGame();

  // Generate rows based on current game state
  const rows = [];

  // Add rows for previous guesses
  for (let i = 0; i < guesses.length; i++) {
    rows.push(
      <Row
        key={i}
        guess={guesses[i].word}
        isCurrentRow={false}
        isRevealing={isRevealing && i === guesses.length - 1}
        evaluation={guesses[i].evaluation}
        isInvalid={invalidGuess.isInvalid && invalidGuess.rowIndex === i}
      />
    );
  }

  // Add current row
  if (gameStatus === 'playing') {
    rows.push(
      <Row
        key={guesses.length}
        guess={currentGuess}
        isCurrentRow={true}
        isInvalid={invalidGuess.isInvalid && invalidGuess.rowIndex === guesses.length}
      />
    );
  }

  // Add empty rows to fill the board
  const emptyRows = MAX_ATTEMPTS - rows.length;
  for (let i = 0; i < emptyRows; i++) {
    rows.push(
      <Row
        key={guesses.length + i + (gameStatus === 'playing' ? 1 : 0)}
        guess=""
        isCurrentRow={false}
      />
    );
  }

  return (
    <div
      className={styles.gameBoard}
      role="grid"
      aria-label="Wordle game board"
    >
      {rows}
    </div>
  );
};

export default GameBoard;
