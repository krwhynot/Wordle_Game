import { render, screen } from '@testing-library/react';
import Tile from '@/components/game/Tile';

describe('Tile', () => {
  // Verify correct display of letters and application of status classes (correct, present, absent) and animation classes.
  test('renders with empty letter and empty status by default', () => {
    render(<Tile position={0} status="empty" />);
    const tileElement = screen.getByRole('gridcell');
    expect(tileElement).toHaveTextContent('');
    expect(tileElement).toHaveClass('tile-empty');
    expect(tileElement).not.toHaveClass('revealed');
    expect(tileElement).toHaveAttribute('aria-label', 'tile 1, , empty');
  });

  test('renders with a letter and filled status', () => {
    render(<Tile letter="A" position={0} status="filled" />);
    const tileElement = screen.getByRole('gridcell');
    expect(tileElement).toHaveTextContent('A');
    expect(tileElement).toHaveClass('tile-filled');
    expect(tileElement).toHaveAttribute('aria-label', 'tile 1, A, filled');
  });

  test('applies correct status class for "correct"', () => {
    render(<Tile letter="B" position={1} status="correct" />);
    const tileElement = screen.getByRole('gridcell');
    expect(tileElement).toHaveClass('tile-correct');
    expect(tileElement).toHaveAttribute('aria-label', 'tile 2, B, correct');
  });

  test('applies correct status class for "present"', () => {
    render(<Tile letter="C" position={2} status="present" />);
    const tileElement = screen.getByRole('gridcell');
    expect(tileElement).toHaveClass('tile-present');
    expect(tileElement).toHaveAttribute('aria-label', 'tile 3, C, present');
  });

  test('applies correct status class for "absent"', () => {
    render(<Tile letter="D" position={3} status="absent" />);
    const tileElement = screen.getByRole('gridcell');
    expect(tileElement).toHaveClass('tile-absent');
    expect(tileElement).toHaveAttribute('aria-label', 'tile 4, D, absent');
  });

  test('applies "revealed" class when isRevealed is true', () => {
    render(<Tile letter="E" position={4} status="correct" isRevealed={true} />);
    const tileElement = screen.getByRole('gridcell');
    expect(tileElement).toHaveClass('revealed');
  });

  test('does not apply "revealed" class when isRevealed is false', () => {
    render(<Tile letter="F" position={0} status="present" isRevealed={false} />);
    const tileElement = screen.getByRole('gridcell');
    expect(tileElement).not.toHaveClass('revealed');
  });

  test('uses custom aria-label if provided', () => {
    render(<Tile letter="G" position={0} status="empty" aria-label="custom label" />);
    const tileElement = screen.getByRole('gridcell');
    expect(tileElement).toHaveAttribute('aria-label', 'custom label');
  });
});
