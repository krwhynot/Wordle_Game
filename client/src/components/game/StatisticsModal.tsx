import type { FC } from 'react';

interface StatisticsModalProps {
  totalGames: number;
  winRate: number;
  distribution: number[]; // counts for guesses 1-6
  onClose: () => void;
  onReset: () => void;
}

const StatisticsModal: FC<StatisticsModalProps> = ({ totalGames, winRate, distribution, onClose, onReset }) => {
  const maxCount = Math.max(...distribution, 1);
  return (
    <div className="statistics-modal-overlay" onClick={onClose}>
      <div className="statistics-modal" onClick={e => e.stopPropagation()}>
        <h2>Statistics</h2>
        <div className="stat-item">
          <span>Games Played</span><span>{totalGames}</span>
        </div>
        <div className="stat-item">
          <span>Win %</span><span>{winRate}%</span>
        </div>
        <h3>Guess Distribution</h3>
        <div className="distribution">
          {distribution.map((count, i) => (
            <div key={i} className="distribution-bar">
              <span className="label">{i + 1}</span>
              <div
                className="bar"
                style={{ width: `${(count / maxCount) * 100}%` }}
              >
                <span>{count}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onReset}>Reset</button>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal;
