import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { setViewportSize, VIEWPORT_SIZES } from '../../testUtils';
import GameBoard from '../../../components/game/GameBoard';
import { GameProvider, useGame } from '../../../contexts/GameContext/GameContext';
import { EvaluationResult, GameContextType } from 'shared';

// Mock the useGame hook and GameProvider
vi.mock('../../../contexts/GameContext/GameContext', () => ({
  useGame: vi.fn(),
  GameProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Mock GameProvider to render children directly
}));

const mockUseGame = useGame as ReturnType<typeof vi.fn>;

const renderWithGameContext = (initialState: Partial<GameContextType> = {}) => {
  const mockGameContext: GameContextType = {
    solution: 'TESTS',
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    isRevealing: false,
    invalidGuess: { isInvalid: false, rowIndex: -1 },
    isGameLoaded: true,
    addLetter: vi.fn(),
    removeLetter: vi.fn(),
    submitGuess: vi.fn(),
    getLetterStatus: vi.fn(),
    resetGame: vi.fn(),
    ...initialState,
  };

  mockUseGame.mockReturnValue(mockGameContext);

  return render(
    <GameProvider> {/* Use the mocked GameProvider */}
      <GameBoard />
    </GameProvider>
  );
};

describe('GameBoard Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  // Tests for visual verification
  describe('Visual Rendering', () => {
    it('renders a game board with 6 rows', () => {
      renderWithGameContext();

      const boardElement = screen.getByRole('grid');
      const rowElements = screen.getAllByRole('row');

      expect(boardElement).toBeInTheDocument();
      expect(rowElements).toHaveLength(6);
    });

    it('renders with current guess in the current row', () => {
      renderWithGameContext({
        guesses: [{ word: 'REACT', evaluation: ['correct', 'present', 'absent', 'correct', 'absent'] as EvaluationResult[] }],
        currentGuess: 'WO',
      });

      const allTiles = screen.getAllByRole('gridcell');

      // First row should have the evaluated guess "REACT"
      expect(allTiles[0].textContent).toBe('R');
      expect(allTiles[1].textContent).toBe('E');
      expect(allTiles[2].textContent).toBe('A');
      expect(allTiles[3].textContent).toBe('C');
      expect(allTiles[4].textContent).toBe('T');

      // First two tiles of second row should have "WO"
      expect(allTiles[5].textContent).toBe('W');
      expect(allTiles[6].textContent).toBe('O');

      // Rest of second row should be empty
      expect(allTiles[7].textContent).toBe('');
      expect(allTiles[8].textContent).toBe('');
      expect(allTiles[9].textContent).toBe('');
    });

    it('applies correct evaluation classes to guessed rows', () => {
      const evaluations: EvaluationResult[] = ['correct', 'present', 'absent', 'absent', 'present'];

      renderWithGameContext({
        guesses: [{ word: 'HELLO', evaluation: evaluations }],
      });

      const firstRowTiles = screen.getAllByRole('gridcell').slice(0, 5);

      expect(firstRowTiles[0]).toHaveClass('tile-correct');
      expect(firstRowTiles[1]).toHaveClass('tile-present');
      expect(firstRowTiles[2]).toHaveClass('tile-absent');
      expect(firstRowTiles[3]).toHaveClass('tile-absent');
      expect(firstRowTiles[4]).toHaveClass('tile-present');
    });

    it('renders empty rows for future guesses', () => {
      renderWithGameContext({
        guesses: [{ word: 'HELLO', evaluation: ['correct', 'present', 'absent', 'absent', 'present'] as EvaluationResult[] }],
      });

      // Get all tiles and check rows 3-6 (indices 10-29)
      const allTiles = screen.getAllByRole('gridcell');

      // Third to sixth rows should be all empty
      for (let i = 10; i < 30; i++) {
        expect(allTiles[i].textContent).toBe('');
        expect(allTiles[i]).toHaveClass('tile-empty');
      }
    });
  });

  // Tests for accessibility
  describe('Accessibility', () => {
    it('has appropriate aria attributes', () => {
      renderWithGameContext();

      const boardElement = screen.getByRole('grid');
      expect(boardElement).toHaveAttribute('aria-label', 'Wordle game board');
    });
  });

  // Tests for responsiveness
  describe('Responsive Design', () => {
    let cleanupViewport: () => void;

    afterEach(() => {
      if (cleanupViewport) {
        cleanupViewport();
      }
    });

    it('adapts to mobile viewport size', () => {
      cleanupViewport = setViewportSize(VIEWPORT_SIZES.MOBILE.width, VIEWPORT_SIZES.MOBILE.height);

      renderWithGameContext({
        guesses: [{ word: 'HELLO', evaluation: ['correct', 'present', 'absent', 'absent', 'present'] as EvaluationResult[] }],
        currentGuess: 'WO',
      });

      const boardElement = screen.getByRole('grid');
      expect(boardElement).toBeInTheDocument();
      expect(window.innerWidth).toBe(VIEWPORT_SIZES.MOBILE.width);
    });

    it('adapts to tablet viewport size', () => {
      cleanupViewport = setViewportSize(VIEWPORT_SIZES.TABLET.width, VIEWPORT_SIZES.TABLET.height);

      renderWithGameContext({
        guesses: [{ word: 'HELLO', evaluation: ['correct', 'present', 'absent', 'absent', 'present'] as EvaluationResult[] }],
        currentGuess: 'WO',
      });

      const boardElement = screen.getByRole('grid');
      expect(boardElement).toBeInTheDocument();
      expect(window.innerWidth).toBe(VIEWPORT_SIZES.TABLET.width);
    });

    it('adapts to desktop viewport size', () => {
      cleanupViewport = setViewportSize(VIEWPORT_SIZES.DESKTOP.width, VIEWPORT_SIZES.DESKTOP.height);

      renderWithGameContext({
        guesses: [{ word: 'HELLO', evaluation: ['correct', 'present', 'absent', 'absent', 'present'] as EvaluationResult[] }],
        currentGuess: 'WO',
      });

      const boardElement = screen.getByRole('grid');
      expect(boardElement).toBeInTheDocument();
      expect(window.innerWidth).toBe(VIEWPORT_SIZES.DESKTOP.width);
    });
  });
});
