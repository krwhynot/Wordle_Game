import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GameBoard from './components/game/GameBoard';
import Keyboard from './components/game/Keyboard';
import { TileStatus } from './components/game/Tile';
import { StatsProvider } from './contexts/StatsContext/StatsContext';
import './styles/main.scss';

const App: React.FC = () => {
  // For static Phase 1 UI demo only - will be replaced with Context in Phase 2
  const [guesses] = useState<string[]>(['REACT', 'CLOUD']);
  const [evaluations] = useState<TileStatus[][]>([
    ['absent', 'present', 'absent', 'correct', 'absent'],
    ['absent', 'absent', 'absent', 'correct', 'absent'],
  ]);
  const [currentRow] = useState(2);
  const [currentGuess] = useState('AZ');

  // Demo key statuses based on previous guesses
  const keyStatus: Record<string, TileStatus> = {
    'R': 'present',
    'E': 'absent',
    'A': 'absent',
    'C': 'correct',
    'T': 'absent',
    'L': 'absent',
    'O': 'absent',
    'U': 'absent',
    'D': 'absent',
  };

  // No-op function - will be implemented in Phase 2
  const handleKey = (key: string) => {
    console.log(`Key pressed: ${key}`);
  };

  return (
    <StatsProvider>
      <div className="app-container">
        <Header />
        <main className="main">
          <GameBoard
            guesses={guesses}
            evaluations={evaluations}
            currentRow={currentRow}
            currentGuess={currentGuess}
          />
          <Keyboard onKey={handleKey} keyStatus={keyStatus} />
        </main>
        <Footer />
      </div>
    </StatsProvider>
  );
};

export default App;
