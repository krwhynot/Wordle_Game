import { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AppBar, Container, Card } from './components/layout';
import './styles/global.scss';

// Inner component that uses the theme context
function AppContent() {
  const [count, setCount] = useState(0);
  const { theme, toggleTheme } = useTheme();
  
  // Icon based on current theme
  const themeIcon = theme === 'dark' ? '☀️' : '🌙';
  
  return (
    <div className="app">
      <AppBar 
        title="F&B Wordle" 
        rightAction={
          <button 
            className="btn-icon" 
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}
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
            
            <button 
              className="btn btn-primary" 
              onClick={() => setCount((count) => count + 1)}
            >
              Count is {count}
            </button>
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
