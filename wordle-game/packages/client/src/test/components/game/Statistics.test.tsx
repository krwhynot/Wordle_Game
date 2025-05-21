import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Statistics from '@/components/game/Statistics';
import StatsContext, { useStats } from '@/contexts/StatsContext/StatsContext';
import { GameStatistics } from '@/contexts/StatsContext/types';
import { vi } from 'vitest'; // Ensure vi is imported

// Mock the useStats hook
vi.mock('@/contexts/StatsContext/StatsContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/contexts/StatsContext/StatsContext')>();
  return {
    ...actual,
    useStats: vi.fn(),
    default: actual.default, // Ensure the default export (StatsContext) is also available
  };
});

describe('Statistics', () => {
  const mockOnClose = vi.fn();

  const defaultStats: GameStatistics = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
  };

  const renderStatistics = (isOpen: boolean, stats: GameStatistics = defaultStats) => {
    (useStats as vi.Mock).mockReturnValue({ statistics: stats, addGameResult: vi.fn(), resetStatistics: vi.fn() });
    render(
      <StatsContext.Provider value={{ statistics: stats, addGameResult: vi.fn(), resetStatistics: vi.fn() }}>
        <Statistics isOpen={isOpen} onClose={mockOnClose} />
      </StatsContext.Provider>
    );
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('does not render when isOpen is false', () => {
    renderStatistics(false);
    expect(screen.queryByText('Statistics')).not.toBeInTheDocument();
  });

  test('renders when isOpen is true', () => {
    renderStatistics(true);
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  test('displays default statistics correctly', () => {
    renderStatistics(true);
    expect(screen.getByText('Played').previousElementSibling).toHaveTextContent('0');
    expect(screen.getByText('Win %').previousElementSibling).toHaveTextContent('0');
    expect(screen.getByText('Current Streak').previousElementSibling).toHaveTextContent('0');
    expect(screen.getByText('Max Streak').previousElementSibling).toHaveTextContent('0');
    // Check guess distribution values
    const guessDistributionElements = screen.getAllByText('0').filter(el => el.className.includes('guess-bar'));
    expect(guessDistributionElements.length).toBe(6);
  });

  test('displays provided statistics correctly', () => {
    const customStats: GameStatistics = {
      gamesPlayed: 10,
      gamesWon: 5,
      currentStreak: 3,
      maxStreak: 5,
      guessDistribution: [0, 1, 2, 3, 2, 2],
    };
    renderStatistics(true, customStats);

    expect(screen.getByText('Played').previousElementSibling).toHaveTextContent('10');
    expect(screen.getByText('Win %').previousElementSibling).toHaveTextContent('50');
    expect(screen.getByText('Current Streak').previousElementSibling).toHaveTextContent('3');
    expect(screen.getByText('Max Streak').previousElementSibling).toHaveTextContent('5');

    // Check specific guess distribution values
    expect(screen.getByText('1', { selector: '.guess-bar' })).toBeInTheDocument();
    expect(screen.getAllByText('2', { selector: '.guess-bar' }).length).toBe(3); // For guess 3, 5, 6
    expect(screen.getByText('3', { selector: '.guess-bar' })).toBeInTheDocument(); // For guess 4
  });

  test('calculates win percentage correctly', () => {
    renderStatistics(true, { ...defaultStats, gamesPlayed: 20, gamesWon: 15 });
    expect(screen.getByText('Win %').previousElementSibling).toHaveTextContent('75');
  });

  test('applies max-value class to the highest guess distribution bar', () => {
    const customStats: GameStatistics = {
      ...defaultStats,
      guessDistribution: [1, 2, 5, 2, 1, 0],
    };
    renderStatistics(true, customStats);

    const guessBars = screen.getAllByText(/\d+/).filter(el => el.className.includes('guess-bar'));
    const guess3Bar = guessBars.find(el => el.textContent === '5');
    expect(guess3Bar).toHaveClass('max-value');

    const guess2Bar = guessBars.find(el => el.textContent === '2');
    expect(guess2Bar).not.toHaveClass('max-value');
  });

  test('calls onClose when the close button is clicked', () => {
    renderStatistics(true);
    fireEvent.click(screen.getByRole('button', { name: '×' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
