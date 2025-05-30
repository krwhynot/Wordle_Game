import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppBar, Container, Card } from './components/layout';
import './styles/global.scss';

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider>
      <div className="app">
        <AppBar 
          title="F&B Wordle" 
          rightAction={
            <button className="btn-icon" aria-label="Toggle theme">
              🌙
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
    </ThemeProvider>
  );
}

export default App;
