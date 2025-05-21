import { renderHook, act } from '@testing-library/react-hooks';
import useKeyHandler from '@/hooks/useKeyHandler';
import { vi } from 'vitest';

describe('useKeyHandler', () => {
  let onKeyDownMock: vi.Mock;

  beforeEach(() => {
    onKeyDownMock = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Verify input from both physical and virtual keyboards.
  // Confirm correct key values are processed (e.g., letters, 'Enter', 'Backspace').
  test('should call onKeyDown with correct key for physical keyboard letter press', () => {
    const { result } = renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    });
    expect(onKeyDownMock).toHaveBeenCalledWith('A');
    expect(result.current.lastKeyPressed).toBe('A');

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'B' }));
    });
    expect(onKeyDownMock).toHaveBeenCalledWith('B');
    expect(result.current.lastKeyPressed).toBe('B');
  });

  test('should call onKeyDown with correct key for physical keyboard special key press (Enter)', () => {
    const { result } = renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });
    expect(onKeyDownMock).toHaveBeenCalledWith('Enter');
    expect(result.current.lastKeyPressed).toBe('Enter');
  });

  test('should call onKeyDown with correct key for physical keyboard special key press (Backspace)', () => {
    const { result } = renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    });
    expect(onKeyDownMock).toHaveBeenCalledWith('Backspace');
    expect(result.current.lastKeyPressed).toBe('Backspace');
  });

  test('should call onKeyDown with correct key for virtual keyboard press', () => {
    const { result } = renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    act(() => {
      result.current.handleVirtualKeyPress('Q');
    });
    expect(onKeyDownMock).toHaveBeenCalledWith('Q');
    expect(result.current.lastKeyPressed).toBe('Q');

    act(() => {
      result.current.handleVirtualKeyPress('ENTER');
    });
    expect(onKeyDownMock).toHaveBeenCalledWith('ENTER');
    expect(result.current.lastKeyPressed).toBe('ENTER');
  });

  test('should not call onKeyDown if key is not allowed', () => {
    renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock, allowedKeys: ['a'] }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    });
    expect(onKeyDownMock).not.toHaveBeenCalled();
  });

  test('should not call onKeyDown if handler is disabled', () => {
    renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock, isEnabled: false }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    });
    expect(onKeyDownMock).not.toHaveBeenCalled();

    const { result } = renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock, isEnabled: false }));
    act(() => {
      result.current.handleVirtualKeyPress('Q');
    });
    expect(onKeyDownMock).not.toHaveBeenCalled();
  });

  test('should clean up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
