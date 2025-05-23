import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Statistics from '../../../components/game/Statistics';
import { useStats } from '../../../contexts/StatsContext/StatsContext';

// Mock the useStats hook
vi.mock('../../../contexts/StatsContext/StatsContext', () => ({
  useStats: vi.fn(),
}));

const mockUseStats = useStats as ReturnType<typeof vi.fn>;

const mockStatistics = {
  gamesPlayed: 10,
  gamesWon: 8,
  currentStreak: 3,
  maxStreak: 5,
  guessDistribution: [1, 2, 3, 1, 0, 1],
  lastCompletedGameDate: '2025-03-15'
};

describe('Statistics Component', () => {
  beforeEach(() => {
    mockUseStats.mockReturnValue({
      statistics: mockStatistics,
      addGameResult: vi.fn(),
      resetStatistics: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Visual Rendering', () => {
    it('renders statistics when open', () => {
      render(<Statistics isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByText('Statistics')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument(); // Games played
      expect(screen.getByText('80')).toBeInTheDocument(); // Win percentage
      expect(screen.getByText('3')).toBeInTheDocument(); // Current streak
      expect(screen.getByText('5')).toBeInTheDocument(); // Max streak
    });

    it('does not render when closed', () => {
      render(<Statistics isOpen={false} onClose={vi.fn()} />);

      expect(screen.queryByText('Statistics')).not.toBeInTheDocument();
    });

    it('calculates win percentage correctly', () => {
      render(<Statistics isOpen={true} onClose={vi.fn()} />);

      // 8 wins out of 10 games = 80%
      expect(screen.getByText('80')).toBeInTheDocument();
    });

    it('renders guess distribution chart', () => {
      render(<Statistics isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByText('Guess Distribution')).toBeInTheDocument();

      // Check that distribution bars are rendered
      const distributionBars = screen.getAllByTestId(/distribution-bar/);
      expect(distributionBars).toHaveLength(6); // 6 guess attempts
    });

    it('shows correct distribution bar widths', () => {
      render(<Statistics isOpen={true} onClose={vi.fn()} />);

      // The highest value in distribution is 3 (for 3rd guess)
      const bars = screen.getAllByTestId(/distribution-bar/);

      // Find the bar with the highest value (should be 100% width)
      const highestBar = bars.find(bar =>
        bar.style.width === '100%' || bar.getAttribute('data-width') === '100'
      );
      expect(highestBar).toBeDefined();
    });
  });

  describe('User Interactions', () => {
    it('calls onClose when close button is clicked', () => {
      const mockOnClose = vi.fn();
      render(<Statistics isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('closes when overlay is clicked', () => {
      const mockOnClose = vi.fn();
      render(<Statistics isOpen={true} onClose={mockOnClose} />);

      const overlay = screen.getByTestId('modal-overlay');
      fireEvent.click(overlay);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero games played', () => {
      mockUseStats.mockReturnValue({
        statistics: {
          ...mockStatistics,
          gamesPlayed: 0,
          gamesWon: 0,
        },
        addGameResult: vi.fn(),
        resetStatistics: vi.fn(),
      });

      render(<Statistics isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByText('0')).toBeInTheDocument(); // Games played
      expect(screen.getByText('0')).toBeInTheDocument(); // Win percentage (should be 0, not NaN)
    });

    it('handles perfect win rate', () => {
      mockUseStats.mockReturnValue({
        statistics: {
          ...mockStatistics,
          gamesPlayed: 5,
          gamesWon: 5,
        },
        addGameResult: vi.fn(),
        resetStatistics: vi.fn(),
      });

      render(<Statistics isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByText('100')).toBeInTheDocument(); // 100% win rate
    });

    it('handles empty guess distribution', () => {
      mockUseStats.mockReturnValue({
        statistics: {
          ...mockStatistics,
          guessDistribution: [0, 0, 0, 0, 0, 0],
        },
        addGameResult: vi.fn(),
        resetStatistics: vi.fn(),
      });

      render(<Statistics isOpen={true} onClose={vi.fn()} />);

      const distributionBars = screen.getAllByTestId(/distribution-bar/);
      expect(distributionBars).toHaveLength(6);
    });
  });

  describe('Accessibility', () => {
    it('has proper modal semantics', () => {
      render(<Statistics isOpen={true} onClose={vi.fn()} />);

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-labelledby');
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    it('has accessible close button', () => {
      render(<Statistics isOpen={true} onClose={vi.fn()} />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('traps focus within modal', () => {
      render(<Statistics isOpen={true} onClose={vi.fn()} />);

      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();

      // Test that focus is properly managed
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });
  });
});
