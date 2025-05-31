import { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AppBar, Container, Card } from './components/layout';
import { Button } from './components/ui';
import './styles/global.scss';

// Inner component that uses the theme context
function AppContent() {
  const [count, setCount] = useState(0);
  const [transitionActive, setTransitionActive] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
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
  
  return (
    <div className="app">
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
            <h2>Welcome to F&B Wordle</h2>
            <p>A word guessing game featuring Food & Beverage industry terminology.</p>
            <p>Game board coming soon!</p>
            
            <Button 
              variant="primary"
              size="medium"
              onClick={() => setCount((count) => count + 1)}
            >
              Count is {count}
            </Button>
          </Card>
        </div>
      </Container>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
