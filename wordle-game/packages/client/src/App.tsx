// Location: packages/client/src/App.tsx
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GameProvider } from '@/contexts/GameContext';
import Header from '@/components/layout/Header';
import GameBoard from '@/components/game/GameBoard';
import Keyboard from '@/components/game/Keyboard';
import '@/styles/main.scss';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GameProvider>
        <div className="app-container">
          <Header />
          <main className="main">
            <GameBoard />
            <Keyboard />
          </main>
          <footer className="footer">
            <p>Wordle Clone - Azure Integrated Project</p>
          </footer>
        </div>
      </GameProvider>
    </ThemeProvider>
  );
};

export default App;
