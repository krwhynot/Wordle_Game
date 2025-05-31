import { useContext } from 'react';
import { SessionContext } from '../contexts/SessionContextDefinitions';

// Hook for consuming the SessionContext
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
