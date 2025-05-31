import { useState, useEffect } from 'react';
import { useSession } from './hooks/useSession';
import { useTheme } from './hooks/useTheme';
import { GameProvider } from './contexts/GameContext';
import { useGame } from './hooks/useGame';
import useNotifications from './hooks/useNotifications';
import { SessionProvider } from './contexts/SessionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppBar, Container, Card } from './components/layout';
import { Button } from './components/ui';
import NotificationSystem from './components/ui/NotificationSystem';
import { GameBoard, Keyboard } from './components/game';
import StatisticsModal from './components/game/StatisticsModal';
import NameEntryModal from './components/game/NameEntryModal';
import './styles/global.scss';

// Inner component that uses the theme and game contexts
function AppContent() {
  const { playerName, setPlayerName } = useSession();
  const nameSubmitted = Boolean(playerName);
  const [transitionActive, setTransitionActive] = useState(false);
  const [showStats, setShowStats] = useState(false);
  // Using type assertion to handle the extended ThemeContextType
  const { theme, highContrast, toggleTheme, toggleHighContrast } = useTheme() as {
    theme: 'light' | 'dark';
    highContrast: boolean;
    toggleTheme: () => void;
    toggleHighContrast: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setHighContrast: (enabled: boolean) => void;
  };
  const { showError, showSuccess } = useNotifications();
  const { 
    gameState, 
    addLetter, 
    removeLetter, 
    submitGuess, 
    resetGame, 
    isRevealing, 
    invalidRowIndex,
    errorMessage 
  } = useGame();
  
  // Icons based on current theme and contrast settings
  const themeIcon = theme === 'dark' ? '☀️' : '🌙';
  const contrastIcon = highContrast ? '🟩' : '🟥'; // Green/red square for contrast indicator
  
  // Watch for game errors and display them
  useEffect(() => {
    if (errorMessage) {
      // Show error using notification system
      showError(errorMessage, { duration: 3000 });
    }
  }, [errorMessage, showError]);
  
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
  
  // Handle high contrast mode toggle
  const handleHighContrastToggle = () => {
    // Show success notification when toggling high contrast mode
    toggleHighContrast();
    showSuccess(`High contrast mode ${highContrast ? 'disabled' : 'enabled'}`, { duration: 2000 });
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
  }, [gameState.isGameOver, gameState.guessedWords.length, gameState.isGameWon]);

  const totalGames = stats.totalGames;
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;
  const distribution = stats.distribution;

  // Handler to reset stored statistics
  const handleStatsReset = () => {
    const initialStats = { totalGames: 0, wins: 0, distribution: Array(maxAttempts).fill(0) };
    localStorage.removeItem('fbwordle_stats');
    setStats(initialStats);
  };

  return (
    <>
      <NameEntryModal 
        isOpen={!nameSubmitted} 
        onSubmit={name => {
          // Save name to both sessionStorage and localStorage for persistence
          sessionStorage.setItem('fbwordle_name', name);
          localStorage.setItem('fbwordle_player', name);
          setPlayerName(name);
        }} 
      />
      {nameSubmitted && (
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
              <div className="app-bar-actions">
                <button 
                  className="btn-icon" 
                  aria-label={`Toggle high contrast mode (${highContrast ? 'on' : 'off'})`}
                  onClick={handleHighContrastToggle}
                  title="High Contrast Mode"
                >
                  {contrastIcon}
                </button>
                <button 
                  className="btn-icon" 
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  onClick={handleThemeToggle}
                  title={`${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                >
                  {themeIcon}
                </button>
              </div>
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
              onReset={handleStatsReset}
            />
          )}
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <NotificationProvider>
          <GameProvider>
            <AppContent />
            <NotificationSystem position="top" />
          </GameProvider>
        </NotificationProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default App;
