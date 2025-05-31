import { useState } from 'react';
import type { ReactNode } from 'react';
import { SessionContext, type Session } from './SessionContextDefinitions';

export const SessionProvider: React.FC<{ children: ReactNode; initialName?: string }> = ({ children, initialName = '' }) => {
  const [session, setSession] = useState<Session>({
    playerName: initialName,
    sessionId: crypto.randomUUID(),
    wordsPlayed: [],
    startTime: new Date(),
  });

  const setPlayerName = (name: string) => setSession(prev => ({ ...prev, playerName: name }));
  const addWordPlayed = (word: string) => setSession(prev => ({ ...prev, wordsPlayed: [...prev.wordsPlayed, word] }));
  const resetSession = () => setSession({ playerName: initialName, sessionId: crypto.randomUUID(), wordsPlayed: [], startTime: new Date() });

  return (
    <SessionContext.Provider value={{
      playerName: session.playerName,
      sessionId: session.sessionId,
      wordsPlayed: session.wordsPlayed,
      startTime: session.startTime,
      setPlayerName,
      addWordPlayed,
      resetSession,
    }}>
      {children}
    </SessionContext.Provider>
  );
};

// Only export the provider component to comply with Fast Refresh requirements
