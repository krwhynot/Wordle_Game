import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Keyboard from '@/components/game/Keyboard';
import { TileStatus } from '@/components/game/Tile';

describe('Keyboard', () => {
  const onKeyMock = vi.fn();
  const defaultKeyStatus: Record<string, TileStatus | undefined> = {};

  beforeEach(() => {
    onKeyMock.mockClear();
  });

  // Ensure all keys render.
  test('renders all keyboard keys', () => {
    render(<Keyboard onKey={onKeyMock} keyStatus={defaultKeyStatus} />);

    const expectedKeys = [
      'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
      'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
      'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'
    ];

    expectedKeys.forEach(key => {
      expect(screen.getByRole('button', { name: key.toLowerCase() === 'enter' ? 'enter' : key.toLowerCase() === 'backspace' ? 'backspace' : `key ${key}` })).toBeInTheDocument();
    });
  });

  // Test onKeyPress functionality for each key.
  test('calls onKey with the correct value when a letter key is clicked', () => {
    render(<Keyboard onKey={onKeyMock} keyStatus={defaultKeyStatus} />);
    fireEvent.click(screen.getByRole('button', { name: 'key Q' }));
    expect(onKeyMock).toHaveBeenCalledTimes(1);
    expect(onKeyMock).toHaveBeenCalledWith('Q');
  });

  test('calls onKey with the correct value when ENTER key is clicked', () => {
    render(<Keyboard onKey={onKeyMock} keyStatus={defaultKeyStatus} />);
    fireEvent.click(screen.getByRole('button', { name: 'enter' }));
    expect(onKeyMock).toHaveBeenCalledTimes(1);
    expect(onKeyMock).toHaveBeenCalledWith('ENTER');
  });

  test('calls onKey with the correct value when BACKSPACE key is clicked', () => {
    render(<Keyboard onKey={onKeyMock} keyStatus={defaultKeyStatus} />);
    fireEvent.click(screen.getByRole('button', { name: 'backspace' }));
    expect(onKeyMock).toHaveBeenCalledTimes(1);
    expect(onKeyMock).toHaveBeenCalledWith('BACKSPACE');
  });

  // Verify key status highlighting (e.g., a used letter turning grey, green, or yellow).
  test('applies correct status class to keys based on keyStatus prop', () => {
    const keyStatus: Record<string, TileStatus | undefined> = {
      'Q': 'correct',
      'W': 'present',
      'E': 'absent',
      'R': 'filled',
    };
    render(<Keyboard onKey={onKeyMock} keyStatus={keyStatus} />);

    expect(screen.getByRole('button', { name: 'key Q' })).toHaveClass('keyboard-key-correct');
    expect(screen.getByRole('button', { name: 'key W' })).toHaveClass('keyboard-key-present');
    expect(screen.getByRole('button', { name: 'key E' })).toHaveClass('keyboard-key-absent');
    expect(screen.getByRole('button', { name: 'key R' })).toHaveClass('keyboard-key-filled');
    expect(screen.getByRole('button', { name: 'key T' })).not.toHaveClass('keyboard-key-empty'); // Default empty
  });

  test('does not apply status class if keyStatus is empty or undefined for a key', () => {
    render(<Keyboard onKey={onKeyMock} keyStatus={defaultKeyStatus} />);
    expect(screen.getByRole('button', { name: 'key A' })).not.toHaveClass('keyboard-key-correct');
    expect(screen.getByRole('button', { name: 'key A' })).not.toHaveClass('keyboard-key-present');
    expect(screen.getByRole('button', { name: 'key A' })).not.toHaveClass('keyboard-key-absent');
  });
});
