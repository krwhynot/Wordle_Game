import React from 'react';
import { useStats } from '../../contexts/StatsContext/StatsContext';

interface StatisticsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({ isOpen, onClose }) => {
  const { statistics } = useStats();

  if (!isOpen) return null;

  const winPercentage = statistics.gamesPlayed > 0
    ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
    : 0;

  // Find the most frequent guess count (for highlighting)
  const maxGuessCount = Math.max(...statistics.guessDistribution);

  return (
    <div className="statistics-modal">
      <div className="statistics-container">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Statistics</h2>

        <div className="statistics-summary">
          <div className="stat-item">
            <div className="stat-value">{statistics.gamesPlayed}</div>
            <div className="stat-label">Played</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{winPercentage}</div>
            <div className="stat-label">Win %</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics.maxStreak}</div>
            <div className="stat-label">Max Streak</div>
          </div>
        </div>

        <h3>Guess Distribution</h3>
        <div className="guess-distribution">
          {statistics.guessDistribution.map((count: number, index: number) => (
            <div className="guess-row" key={index}>
              <div className="guess-label">{index + 1}</div>
              <div
                className={`guess-bar ${count === maxGuessCount && count > 0 ? 'max-value' : ''}`}
                style={{
                  width: count > 0 ? `${Math.max(7, (count / maxGuessCount) * 100)}%` : '7%',
                }}
              >
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
