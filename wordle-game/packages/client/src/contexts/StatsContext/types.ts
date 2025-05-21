export interface GameStatistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  lastCompletedGameDate?: string;
}

export interface StatsContextType {
  statistics: GameStatistics;
  addGameResult: (won: boolean, attempts: number) => void;
  resetStatistics: () => void;
}
