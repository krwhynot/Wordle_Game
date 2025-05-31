import { useState, useEffect } from 'react';
import { useSession } from './hooks/useSession';
import { useTheme } from './hooks/useTheme';
import { GameProvider } from './contexts/GameContext';
import { useGame } from './hooks/useGame';
import useNotifications from './hooks/useNotifications';
import usePWAInstall from './hooks/usePWAInstall';
import { SessionProvider } from './contexts/SessionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppBar, Container, Card } from './components/layout';
import { Button } from './components/ui';
import NotificationSystem from './components/ui/NotificationSystem';
import { GameBoard, Keyboard } from './components/game';
import StatisticsModal from './components/game/StatisticsModal';
import SettingsModal from './components/game/SettingsModal';
import HelpModal from './components/game/HelpModal';
import { loadStats, saveGameResult, resetStatistics, PlayerStatistics, GameResult } from './services/statisticsService';
import NameEntryModal from './components/game/NameEntryModal';
import ErrorBoundary from './components/ui/ErrorBoundary';
import './styles/global.scss';

// Inner component that uses the theme and game contexts
function AppContent() {
  const { playerName, setPlayerName } = useSession();
  const nameSubmitted = Boolean(playerName);
  const [transitionActive, setTransitionActive] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
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
  const { deferredPrompt, installApp, isAppInstalled } = usePWAInstall();
  const { 
    gameState, 
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
    isRevealing,
    invalidRowIndex,
    gameAttempts,
    gameWord,
    gameSolution
  } = useGame();

  const [statistics, setStatistics] = useState<PlayerStatistics>(loadStats());
  const { totalGames, winRate, distribution } = statistics;

  useEffect(() => {
    if (gameState.isGameOver) {
      saveGameResult(gameState.isGameWon, gameAttempts, gameWord);
      setStatistics(loadStats()); // Reload stats after game over
    }
  }, [gameState.isGameOver, gameState.isGameWon, gameAttempts, gameWord]);

  const handleStatsReset = () => {
    resetStatistics();
    setStatistics(loadStats());
    showSuccess('Statistics reset successfully!');
  };

  return (
    <>
      <AppBar
        title="F&B Wordle"
        onHelpClick={() => setShowHelp(true)}
        onStatsClick={() => setShowStats(true)}
        onSettingsClick={() => setShowSettings(true)}
      >
        <Button variant="text" onClick={() => setShowHelp(true)} aria-label="Help">
          <span className="material-icons">help_outline</span>
        </Button>
        <Button variant="text" onClick={() => setShowStats(true)} aria-label="Statistics">
          <span className="material-icons">leaderboard</span>
        </Button>
        <Button variant="text" onClick={() => setShowSettings(true)} aria-label="Settings">
          <span className="material-icons">settings</span>
        </Button>
        {!isAppInstalled && deferredPrompt && (
          <Button variant="text" onClick={installApp} aria-label="Install App">
            <span className="material-icons">download_for_offline</span>
          </Button>
        )}
      </AppBar>

      {!nameSubmitted ? (
        <NameEntryModal
          onNameSubmit={(name) => setPlayerName(name)}
        />
      ) : (
        <div className="app-container">
          <Container>
            <div className="game-section">
              <Card className="text-center">
                <h1>F&B Wordle</h1>
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
