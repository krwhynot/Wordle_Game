import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { GameProvider, useGame } from './contexts/GameContext';
import { AppBar, Container, Card } from './components/layout';
import { Button } from './components/ui';
import { GameBoard, Keyboard } from './components/game';
import StatisticsModal from './components/game/StatisticsModal';
import './styles/global.scss';

// Inner component that uses the theme and game contexts
function AppContent() {
  const [transitionActive, setTransitionActive] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { gameState, addLetter, removeLetter, submitGuess, resetGame, isRevealing, invalidRowIndex } = useGame();
  
  // Icon based on current theme
  const themeIcon = theme === 'dark' ? '☀️' : '🌙';
  
  // Handle theme toggle with transition effect
  const handleThemeToggle = () => {
    // Activate transition overlay
    setTransitionActive(true);
    
    // Wait a short time to let the animation start before changing theme
    setTimeout(() => {
      toggleTheme();
      
      // Deactivate transition overlay after theme has changed
      setTimeout(() => {
        setTransitionActive(false);
      }, 500); // Match this to animation duration
    }, 50);
  };
  
  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (gameState.isGameOver) return;
    
    const key = e.key.toUpperCase();
    
    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      removeLetter();
    } else if (/^[A-Z]$/.test(key)) {
      addLetter(key);
    }
  };
  
  interface Stats { totalGames: number; wins: number; distribution: number[]; }
  const maxAttempts = gameState.gameBoard.maxAttempts;
  const [stats, setStats] = useState<Stats>(() => {
    const saved = localStorage.getItem('fbwordle_stats');
    return saved
      ? JSON.parse(saved)
      : { totalGames: 0, wins: 0, distribution: Array(maxAttempts).fill(0) };
  });

  useEffect(() => {
    if (gameState.isGameOver) {
      setStats(prev => {
        const attempts = gameState.guessedWords.length;
        const distribution = [...prev.distribution];
        if (attempts >= 1 && attempts <= distribution.length) distribution[attempts - 1]++;
        const newStats = {
          totalGames: prev.totalGames + 1,
          wins: prev.wins + (gameState.isGameWon ? 1 : 0),
          distribution,
        };
        localStorage.setItem('fbwordle_stats', JSON.stringify(newStats));
        return newStats;
      });
      setShowStats(true);
    }
  }, [gameState.isGameOver]);

  const totalGames = stats.totalGames;
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;
  const distribution = stats.distribution;

  return (
    <div 
      className="app" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
    >
      {/* Theme transition overlay */}
      <div className={`theme-transition-overlay ${transitionActive ? 'active' : ''}`} />
      
      <AppBar 
        title="F&B Wordle" 
        rightAction={
          <button 
            className="btn-icon" 
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={handleThemeToggle}
          >
            {themeIcon}
          </button>
        }
      />
      
      <Container>
        <div className="game-container">
          <Card className="text-center" elevation={2}>
            <h2>F&B Wordle</h2>
            <p>A word guessing game featuring Food & Beverage industry terminology.</p>
            
            {/* Game Board */}
            <GameBoard 
              gameBoard={gameState.gameBoard}
              isRevealing={isRevealing}
              invalidRowIndex={invalidRowIndex}
            />
            
            {/* Virtual keyboard */}
            <Keyboard />
            
            {/* Game status and controls */}
            <div className="game-controls">
              {gameState.isGameOver && (
                <div className="game-result">
                  {gameState.isGameWon ? (
                    <p className="success-message">Congratulations! You guessed the word!</p>
                  ) : (
                    <p className="failure-message">Game over! The word was {gameState.targetWord}</p>
                  )}
                  <Button 
                    variant="primary" 
                    onClick={() => resetGame()}
                  >
                    Play Again
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </Container>
      
      {/* Statistics Modal */}
      {showStats && (
        <StatisticsModal
          totalGames={totalGames}
          winRate={winRate}
          distribution={distribution}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
