import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { setViewportSize, VIEWPORT_SIZES } from '../../testUtils';
import GameBoard from '../../../components/game/GameBoard';
import { TileStatus } from '../../../components/game/Tile';

describe('GameBoard Component', () => {
  afterEach(() => {
    cleanup();
  });

  // Tests for visual verification
  describe('Visual Rendering', () => {
    it('renders a game board with 6 rows', () => {
      render(
        <GameBoard
          guesses={[]}
          evaluations={[]}
          currentRow={0}
          currentGuess=""
        />
      );

      const boardElement = screen.getByRole('grid');
      const rowElements = screen.getAllByRole('row');

      expect(boardElement).toBeInTheDocument();
      expect(rowElements).toHaveLength(6);
    });

    it('renders with current guess in the current row', () => {
      render(
        <GameBoard
          guesses={['REACT']}
          evaluations={[['correct', 'present', 'absent', 'correct', 'absent']]}
          currentRow={1}
          currentGuess="WO"
        />
      );

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
      const evaluations: TileStatus[][] = [
        ['correct', 'present', 'absent', 'absent', 'present']
      ];

      render(
        <GameBoard
          guesses={['HELLO']}
          evaluations={evaluations}
          currentRow={1}
          currentGuess=""
        />
      );

      const firstRowTiles = screen.getAllByRole('gridcell').slice(0, 5);

      expect(firstRowTiles[0]).toHaveClass('tile-correct');
      expect(firstRowTiles[1]).toHaveClass('tile-present');
      expect(firstRowTiles[2]).toHaveClass('tile-absent');
      expect(firstRowTiles[3]).toHaveClass('tile-absent');
      expect(firstRowTiles[4]).toHaveClass('tile-present');
    });

    it('renders empty rows for future guesses', () => {
      render(
        <GameBoard
          guesses={['HELLO']}
          evaluations={[['correct', 'present', 'absent', 'absent', 'present']]}
          currentRow={1}
          currentGuess=""
        />
      );

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
      render(
        <GameBoard
          guesses={[]}
          evaluations={[]}
          currentRow={0}
          currentGuess=""
        />
      );

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

      render(
        <GameBoard
          guesses={['HELLO']}
          evaluations={[['correct', 'present', 'absent', 'absent', 'present']]}
          currentRow={1}
          currentGuess="WO"
        />
      );

      const boardElement = screen.getByRole('grid');
      expect(boardElement).toBeInTheDocument();
      expect(window.innerWidth).toBe(VIEWPORT_SIZES.MOBILE.width);
    });

    it('adapts to tablet viewport size', () => {
      cleanupViewport = setViewportSize(VIEWPORT_SIZES.TABLET.width, VIEWPORT_SIZES.TABLET.height);

      render(
        <GameBoard
          guesses={['HELLO']}
          evaluations={[['correct', 'present', 'absent', 'absent', 'present']]}
          currentRow={1}
          currentGuess="WO"
        />
      );

      const boardElement = screen.getByRole('grid');
      expect(boardElement).toBeInTheDocument();
      expect(window.innerWidth).toBe(VIEWPORT_SIZES.TABLET.width);
    });

    it('adapts to desktop viewport size', () => {
      cleanupViewport = setViewportSize(VIEWPORT_SIZES.DESKTOP.width, VIEWPORT_SIZES.DESKTOP.height);

      render(
        <GameBoard
          guesses={['HELLO']}
          evaluations={[['correct', 'present', 'absent', 'absent', 'present']]}
          currentRow={1}
          currentGuess="WO"
        />
      );

      const boardElement = screen.getByRole('grid');
      expect(boardElement).toBeInTheDocument();
      expect(window.innerWidth).toBe(VIEWPORT_SIZES.DESKTOP.width);
    });
  });
});
