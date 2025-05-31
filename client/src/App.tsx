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
  
  // Open stats when game ends
  useEffect(() => {
    if (gameState.isGameOver) {
      setShowStats(true);
    }
  }, [gameState.isGameOver]);
  
  // Prepare statistics data
  const totalGames = 1;
  const distribution = Array(gameState.gameBoard.maxAttempts).fill(0);
  if (gameState.isGameOver) {
    const attempts = gameState.guessedWords.length;
    if (attempts >= 1 && attempts <= distribution.length) distribution[attempts - 1] = 1;
  }
  const winRate = Math.round((distribution.reduce((sum, count) => sum + count, 0) / totalGames) * 100);
  
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
