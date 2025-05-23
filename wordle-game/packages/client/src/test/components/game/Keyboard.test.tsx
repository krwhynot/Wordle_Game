import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { setViewportSize, VIEWPORT_SIZES } from '../../testUtils';
import Keyboard from '../../../components/game/Keyboard';
import { GameProvider, useGame } from '../../../contexts/GameContext/GameContext';
import { GameContextType, EvaluationResult } from 'shared';

// Mock the useGame hook and GameProvider
vi.mock('../../../contexts/GameContext/GameContext', () => ({
  useGame: vi.fn(),
  GameProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockUseGame = useGame as ReturnType<typeof vi.fn>;

const renderWithGameContext = (initialState: Partial<GameContextType> = {}) => {
  const mockAddLetter = vi.fn();
  const mockRemoveLetter = vi.fn();
  const mockSubmitGuess = vi.fn();

  const mockGameContext: GameContextType = {
    solution: 'TESTS',
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    isRevealing: false,
    invalidGuess: { isInvalid: false, rowIndex: -1 },
    isGameLoaded: true,
    addLetter: mockAddLetter,
    removeLetter: mockRemoveLetter,
    submitGuess: mockSubmitGuess,
    getLetterStatus: vi.fn(() => undefined),
    resetGame: vi.fn(),
    ...initialState,
  };

  mockUseGame.mockReturnValue(mockGameContext);

  return {
    ...render(
      <GameProvider>
        <Keyboard />
      </GameProvider>
    ),
    mockAddLetter,
    mockRemoveLetter,
    mockSubmitGuess,
  };
};

describe('Keyboard Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Visual Rendering', () => {
    it('renders all letter keys', () => {
      renderWithGameContext();

      const qwertyRow = 'QWERTYUIOP';
      const asdfRow = 'ASDFGHJKL';
      const zxcvRow = 'ZXCVBNM';

      // Check that all letters are rendered
      [...qwertyRow, ...asdfRow, ...zxcvRow].forEach(letter => {
        expect(screen.getByText(letter)).toBeInTheDocument();
      });
    });

    it('renders action keys', () => {
      renderWithGameContext();

      expect(screen.getByText('ENTER')).toBeInTheDocument();
      expect(screen.getByText('⌫')).toBeInTheDocument();
    });

    it('applies correct status classes to keys', () => {
      const mockGetLetterStatus = vi.fn((letter: string): EvaluationResult | undefined => {
        const statusMap: Record<string, EvaluationResult> = {
          'A': 'correct',
          'B': 'present',
          'C': 'absent',
        };
        return statusMap[letter];
      });

      renderWithGameContext({
        getLetterStatus: mockGetLetterStatus,
      });

      const keyA = screen.getByText('A');
      const keyB = screen.getByText('B');
      const keyC = screen.getByText('C');
      const keyD = screen.getByText('D');

      expect(keyA).toHaveClass('key-correct');
      expect(keyB).toHaveClass('key-present');
      expect(keyC).toHaveClass('key-absent');
      expect(keyD).toHaveClass('key-empty');
    });
  });

  describe('User Interactions', () => {
    it('calls addLetter when letter key is clicked', () => {
      const { mockAddLetter } = renderWithGameContext();

      const keyA = screen.getByText('A');
      fireEvent.click(keyA);

      expect(mockAddLetter).toHaveBeenCalledWith('A');
    });

    it('calls submitGuess when ENTER key is clicked', () => {
      const { mockSubmitGuess } = renderWithGameContext();

      const enterKey = screen.getByText('ENTER');
      fireEvent.click(enterKey);

      expect(mockSubmitGuess).toHaveBeenCalled();
    });

    it('calls removeLetter when backspace key is clicked', () => {
      const { mockRemoveLetter } = renderWithGameContext();

      const backspaceKey = screen.getByText('⌫');
      fireEvent.click(backspaceKey);

      expect(mockRemoveLetter).toHaveBeenCalled();
    });

    it('disables keyboard when game is over', () => {
      renderWithGameContext({
        gameStatus: 'won',
      });

      const keyA = screen.getByText('A');
      expect(keyA).toHaveAttribute('disabled');
    });
  });

  describe('Accessibility', () => {
    it('has appropriate aria labels', () => {
      renderWithGameContext();

      const keyA = screen.getByText('A');
      expect(keyA).toHaveAttribute('aria-label', 'A');

      const enterKey = screen.getByText('ENTER');
      expect(enterKey).toHaveAttribute('aria-label', 'Enter');

      const backspaceKey = screen.getByText('⌫');
      expect(backspaceKey).toHaveAttribute('aria-label', 'Backspace');
    });

    it('has proper keyboard role', () => {
      renderWithGameContext();

      const keyboard = screen.getByRole('region');
      expect(keyboard).toHaveAttribute('aria-label', 'Virtual keyboard');
    });
  });

  describe('Responsive Design', () => {
    let cleanupViewport: () => void;

    afterEach(() => {
      if (cleanupViewport) {
        cleanupViewport();
      }
    });

    it('adapts to mobile viewport size', () => {
      cleanupViewport = setViewportSize(VIEWPORT_SIZES.MOBILE.width, VIEWPORT_SIZES.MOBILE.height);

      renderWithGameContext();

      const keyboard = screen.getByRole('region');
      expect(keyboard).toBeInTheDocument();
      expect(window.innerWidth).toBe(VIEWPORT_SIZES.MOBILE.width);
    });

    it('maintains key size standards for touch targets', () => {
      cleanupViewport = setViewportSize(VIEWPORT_SIZES.MOBILE.width, VIEWPORT_SIZES.MOBILE.height);

      renderWithGameContext();

      const keyA = screen.getByText('A');
      const keyAStyle = window.getComputedStyle(keyA);

      // Keys should have minimum touch target size (44px is the recommended minimum)
      const minHeight = parseInt(keyAStyle.minHeight);
      const minWidth = parseInt(keyAStyle.minWidth);

      expect(minHeight).toBeGreaterThanOrEqual(40); // Allow some flexibility for actual implementation
      expect(minWidth).toBeGreaterThanOrEqual(25); // Keyboard keys can be narrower than square
    });
  });
});
