import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useKeyHandler from '../../hooks/useKeyHandler';

describe('useKeyHandler', () => {
  let onKeyDownMock: ReturnType<typeof vi.fn>;
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    onKeyDownMock = vi.fn();
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds event listener on mount', () => {
    renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('removes event listener on unmount', () => {
    const { unmount } = renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('calls onKeyDown callback when allowed key is pressed', () => {
    renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    // Simulate a keydown event
    const event = new KeyboardEvent('keydown', { key: 'a' });
    window.dispatchEvent(event);

    expect(onKeyDownMock).toHaveBeenCalledWith('A'); // Should be normalized to uppercase
  });

  it('handles multiple key presses', () => {
    renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    // Simulate multiple keydown events
    const eventA = new KeyboardEvent('keydown', { key: 'a' });
    const eventB = new KeyboardEvent('keydown', { key: 'b' });

    window.dispatchEvent(eventA);
    window.dispatchEvent(eventB);

    expect(onKeyDownMock).toHaveBeenCalledTimes(2);
    expect(onKeyDownMock).toHaveBeenNthCalledWith(1, 'A');
    expect(onKeyDownMock).toHaveBeenNthCalledWith(2, 'B');
  });

  it('updates event listener when callback changes', () => {
    const newOnKeyDownMock = vi.fn();

    const { rerender } = renderHook(
      ({ callback }) => useKeyHandler({ onKeyDown: callback }),
      { initialProps: { callback: onKeyDownMock } }
    );

    // Simulate a keydown event with the first callback
    const event1 = new KeyboardEvent('keydown', { key: 'a' });
    window.dispatchEvent(event1);

    expect(onKeyDownMock).toHaveBeenCalledWith('A');
    expect(newOnKeyDownMock).not.toHaveBeenCalled();

    // Update the callback
    rerender({ callback: newOnKeyDownMock });

    // Simulate another keydown event with the new callback
    const event2 = new KeyboardEvent('keydown', { key: 'b' });
    window.dispatchEvent(event2);

    expect(newOnKeyDownMock).toHaveBeenCalledWith('B');
    expect(onKeyDownMock).toHaveBeenCalledTimes(1); // Should not be called again
  });

  it('handles special keys', () => {
    renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    const specialKeys = ['Enter', 'Backspace'];

    specialKeys.forEach(key => {
      const event = new KeyboardEvent('keydown', { key });
      window.dispatchEvent(event);
    });

    expect(onKeyDownMock).toHaveBeenCalledTimes(specialKeys.length);
    expect(onKeyDownMock).toHaveBeenNthCalledWith(1, 'Enter');
    expect(onKeyDownMock).toHaveBeenNthCalledWith(2, 'Backspace');
  });

  it('ignores disallowed keys', () => {
    renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    const disallowedKeys = ['Escape', 'Tab', 'ArrowUp', 'F1'];

    disallowedKeys.forEach(key => {
      const event = new KeyboardEvent('keydown', { key });
      window.dispatchEvent(event);
    });

    expect(onKeyDownMock).not.toHaveBeenCalled();
  });

  it('can be disabled', () => {
    renderHook(() => useKeyHandler({
      onKeyDown: onKeyDownMock,
      isEnabled: false
    }));

    const event = new KeyboardEvent('keydown', { key: 'a' });
    window.dispatchEvent(event);

    expect(onKeyDownMock).not.toHaveBeenCalled();
  });

  it('supports custom allowed keys', () => {
    const customAllowedKeys = ['1', '2', '3'];

    renderHook(() => useKeyHandler({
      onKeyDown: onKeyDownMock,
      allowedKeys: customAllowedKeys
    }));

    // Test allowed custom key
    const allowedEvent = new KeyboardEvent('keydown', { key: '1' });
    window.dispatchEvent(allowedEvent);

    expect(onKeyDownMock).toHaveBeenCalledWith('1');

    // Test disallowed key (even a normally allowed letter)
    const disallowedEvent = new KeyboardEvent('keydown', { key: 'a' });
    window.dispatchEvent(disallowedEvent);

    expect(onKeyDownMock).toHaveBeenCalledTimes(1); // Should not be called again
  });

  it('provides virtual key press function', () => {
    const { result } = renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    result.current.handleVirtualKeyPress('Z');

    expect(onKeyDownMock).toHaveBeenCalledWith('Z');
  });

  it('tracks last key pressed', () => {
    const { result } = renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    expect(result.current.lastKeyPressed).toBeNull();

    // Simulate physical key press
    const event = new KeyboardEvent('keydown', { key: 'q' });
    window.dispatchEvent(event);

    expect(result.current.lastKeyPressed).toBe('Q');

    // Simulate virtual key press
    result.current.handleVirtualKeyPress('Enter');

    expect(result.current.lastKeyPressed).toBe('Enter');
  });

  it('normalizes letter keys to uppercase', () => {
    renderHook(() => useKeyHandler({ onKeyDown: onKeyDownMock }));

    const lowerCaseEvent = new KeyboardEvent('keydown', { key: 'q' });
    const upperCaseEvent = new KeyboardEvent('keydown', { key: 'Q' });

    window.dispatchEvent(lowerCaseEvent);
    window.dispatchEvent(upperCaseEvent);

    expect(onKeyDownMock).toHaveBeenCalledTimes(2);
    expect(onKeyDownMock).toHaveBeenNthCalledWith(1, 'Q');
    expect(onKeyDownMock).toHaveBeenNthCalledWith(2, 'Q');
  });
});
