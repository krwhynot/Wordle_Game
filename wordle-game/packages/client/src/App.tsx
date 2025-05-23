import React from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GameBoard from './components/game/GameBoard';
import Keyboard from './components/game/Keyboard';
import { GameProvider } from './contexts/GameContext/GameContext';
import { StatsProvider } from './contexts/StatsContext/StatsContext';
import './styles/main.scss';

const App: React.FC = () => {
  return (
    <GameProvider>
      <StatsProvider>
        <div className="app-container">
          <Header />
          <main className="main">
            <GameBoard />
            <Keyboard />
          </main>
          <Footer />
        </div>
      </StatsProvider>
    </GameProvider>
  );
};

export default App;
