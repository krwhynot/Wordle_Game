import { useContext } from 'react';
import { GameContext } from '../contexts/GameContextDefinitions';

// Hook for consuming the GameContext
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
