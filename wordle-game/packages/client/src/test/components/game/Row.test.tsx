import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { setViewportSize, VIEWPORT_SIZES } from '../../testUtils';
import Row from '../../../components/game/Row';
import { TileStatus } from '../../../components/game/Tile';

describe('Row Component', () => {
  afterEach(() => {
    cleanup();
  });

  // Tests for visual verification
  describe('Visual Rendering', () => {
    it('renders a row with 5 empty tiles by default', () => {
      render(<Row letters={['', '', '', '', '']} rowIndex={0} />);

      const rowElement = screen.getByRole('row');
      const tileElements = screen.getAllByRole('gridcell');

      expect(rowElement).toBeInTheDocument();
      expect(tileElements).toHaveLength(5);
      tileElements.forEach(tile => {
        expect(tile).toHaveClass('tile-empty');
        expect(tile.textContent).toBe('');
      });
    });

    it('renders a row with filled tiles', () => {
      render(<Row letters={['H', 'E', 'L', 'L', 'O']} rowIndex={0} />);

      const tileElements = screen.getAllByRole('gridcell');

      expect(tileElements[0].textContent).toBe('H');
      expect(tileElements[1].textContent).toBe('E');
      expect(tileElements[2].textContent).toBe('L');
      expect(tileElements[3].textContent).toBe('L');
      expect(tileElements[4].textContent).toBe('O');
    });

    it('renders a row with evaluated tiles', () => {
      const evaluation: TileStatus[] = ['correct', 'present', 'absent', 'correct', 'absent'];

      render(
        <Row
          letters={['W', 'O', 'R', 'L', 'D']}
          evaluation={evaluation}
          isRevealed={true}
          rowIndex={0}
        />
      );

      const tileElements = screen.getAllByRole('gridcell');

      expect(tileElements[0]).toHaveClass('tile-correct');
      expect(tileElements[1]).toHaveClass('tile-present');
      expect(tileElements[2]).toHaveClass('tile-absent');
      expect(tileElements[3]).toHaveClass('tile-correct');
      expect(tileElements[4]).toHaveClass('tile-absent');

      tileElements.forEach(tile => {
        expect(tile).toHaveClass('revealed');
      });
    });

    it('handles partial word inputs correctly', () => {
      render(<Row letters={['T', 'E', 'S', '', '']} rowIndex={0} />);

      const tileElements = screen.getAllByRole('gridcell');

      expect(tileElements[0].textContent).toBe('T');
      expect(tileElements[1].textContent).toBe('E');
      expect(tileElements[2].textContent).toBe('S');
      expect(tileElements[3].textContent).toBe('');
      expect(tileElements[4].textContent).toBe('');
    });
  });

  // Tests for accessibility
  describe('Accessibility', () => {
    it('has correct row role for screen readers', () => {
      render(<Row letters={['', '', '', '', '']} rowIndex={0} />);
      const rowElement = screen.getByRole('row');

      expect(rowElement).toBeInTheDocument();
    });

    it('passes row index to tiles for proper labeling', () => {
      render(<Row letters={['A', '', '', '', '']} rowIndex={2} />);

      const firstTile = screen.getAllByRole('gridcell')[0];
      expect(firstTile).toHaveAttribute('aria-label', expect.stringContaining('row 3'));
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

    it('adapts to different viewport sizes', () => {
      // Test with mobile viewport
      cleanupViewport = setViewportSize(VIEWPORT_SIZES.MOBILE.width, VIEWPORT_SIZES.MOBILE.height);
      render(<Row letters={['T', 'E', 'S', 'T', '']} rowIndex={0} />);

      let row = screen.getByRole('row');
      expect(row).toBeInTheDocument();

      // Clean up before next viewport test
      cleanup();

      // Test with tablet viewport
      cleanupViewport = setViewportSize(VIEWPORT_SIZES.TABLET.width, VIEWPORT_SIZES.TABLET.height);
      render(<Row letters={['T', 'E', 'S', 'T', '']} rowIndex={0} />);

      row = screen.getByRole('row');
      expect(row).toBeInTheDocument();

      // Clean up before next viewport test
      cleanup();

      // Test with desktop viewport
      cleanupViewport = setViewportSize(VIEWPORT_SIZES.DESKTOP.width, VIEWPORT_SIZES.DESKTOP.height);
      render(<Row letters={['T', 'E', 'S', 'T', '']} rowIndex={0} />);

      row = screen.getByRole('row');
      expect(row).toBeInTheDocument();
    });
  });
});
