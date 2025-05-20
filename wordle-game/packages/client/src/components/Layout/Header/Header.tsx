// Location: packages/client/src/components/layout/Header/Header.tsx
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useGame } from '../../../context/GameContext';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { gameStatus, resetGame, solution } = useGame();

  // Format and display game status message
  const renderGameStatus = () => {
    if (gameStatus === 'won') {
      return <div className={styles.gameStatus}>You won! 🎉</div>;
    } else if (gameStatus === 'lost') {
      return (
        <div className={styles.gameStatus}>
          Solution: <span className={styles.solution}>{solution.toUpperCase()}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        {/* Add help or reset button later */}
        {gameStatus !== 'playing' && (
          <button
            className={styles.resetButton}
            onClick={resetGame}
            aria-label="Reset game"
          >
            ↺
          </button>
        )}
      </div>

      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Wordle</h1>
        {renderGameStatus()}
      </div>

      <div className={styles.headerRight}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};

export default Header;
