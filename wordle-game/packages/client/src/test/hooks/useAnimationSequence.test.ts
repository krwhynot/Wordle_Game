import { renderHook, act } from '@testing-library/react-hooks';
import useAnimationSequence from '@/hooks/useAnimationSequence';
import { vi } from 'vitest';

describe('useAnimationSequence', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test tile flip animation on guess submission.
  test('should advance currentStep and set isAnimating to true when startSequence is called', () => {
    const { result } = renderHook(() => useAnimationSequence(5));

    expect(result.current.currentStep).toBe(-1);
    expect(result.current.isAnimating).toBe(false);

    act(() => {
      result.current.startSequence();
    });

    expect(result.current.currentStep).toBe(0);
    expect(result.current.isAnimating).toBe(true);
  });

  test('should advance through steps with correct delays', () => {
    const onCompleteMock = vi.fn();
    const { result } = renderHook(() => useAnimationSequence(3, { duration: 300, delay: 100, onComplete: onCompleteMock }));

    act(() => {
      result.current.startSequence();
    });

    // Step 0 (initial delay)
    expect(result.current.currentStep).toBe(0);
    act(() => {
      vi.advanceTimersByTime(100); // Advance by initial delay
    });
    expect(result.current.currentStep).toBe(1);

    // Step 1 (duration / steps)
    act(() => {
      vi.advanceTimersByTime(100); // Advance by (300 / 3)
    });
    expect(result.current.currentStep).toBe(2);

    // Step 2 (duration / steps)
    act(() => {
      vi.advanceTimersByTime(100); // Advance by (300 / 3)
    });
    expect(result.current.currentStep).toBe(3); // Sequence complete (steps reached)

    expect(result.current.isAnimating).toBe(false);
    expect(onCompleteMock).toHaveBeenCalledTimes(1);
  });

  test('should call onComplete when animation sequence finishes', () => {
    const onCompleteMock = vi.fn();
    const { result } = renderHook(() => useAnimationSequence(1, { onComplete: onCompleteMock }));

    act(() => {
      result.current.startSequence();
    });

    act(() => {
      vi.advanceTimersByTime(1500); // Default duration
    });

    expect(onCompleteMock).toHaveBeenCalledTimes(1);
    expect(result.current.isAnimating).toBe(false);
  });

  test('should reset sequence when resetSequence is called', () => {
    const { result } = renderHook(() => useAnimationSequence(5));

    act(() => {
      result.current.startSequence();
    });
    expect(result.current.isAnimating).toBe(true);
    expect(result.current.currentStep).toBe(0);

    act(() => {
      result.current.resetSequence();
    });
    expect(result.current.isAnimating).toBe(false);
    expect(result.current.currentStep).toBe(-1);
  });

  test('should not advance if not animating', () => {
    const { result } = renderHook(() => useAnimationSequence(3));

    vi.advanceTimersByTime(10000); // A long time
    expect(result.current.currentStep).toBe(-1);
  });

  test('should handle zero steps gracefully', () => {
    const onCompleteMock = vi.fn();
    const { result } = renderHook(() => useAnimationSequence(0, { onComplete: onCompleteMock }));

    act(() => {
      result.current.startSequence();
    });

    expect(result.current.currentStep).toBe(0); // It will immediately go to 0, then complete
    expect(result.current.isAnimating).toBe(false);
    expect(onCompleteMock).toHaveBeenCalledTimes(1);
  });
});
