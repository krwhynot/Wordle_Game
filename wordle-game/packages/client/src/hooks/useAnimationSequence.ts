import { useState, useEffect, useCallback } from 'react';

interface AnimationSequenceOptions {
  duration?: number;
  delay?: number;
  onComplete?: () => void;
}

function useAnimationSequence(steps: number, options: AnimationSequenceOptions = {}) {
  const {
    duration = 1500,
    delay = 0,
    onComplete
  } = options;

  const [currentStep, setCurrentStep] = useState(-1); // -1 means not started
  const [isAnimating, setIsAnimating] = useState(false);

  // Start the animation sequence
  const startSequence = useCallback(() => {
    setIsAnimating(true);
    setCurrentStep(0);
  }, []);

  // Reset the animation sequence
  const resetSequence = useCallback(() => {
    setIsAnimating(false);
    setCurrentStep(-1);
  }, []);

  // Advance through the steps with delays
  useEffect(() => {
    if (!isAnimating) return;

    if (currentStep === -1) {
      // Not started yet, do nothing
      return;
    }

    if (currentStep >= steps) {
      // Sequence complete
      setIsAnimating(false);
      onComplete?.();
      return;
    }

    // Calculate delay for this step (first step gets initial delay, others get staggered)
    const stepDelay = currentStep === 0
      ? delay
      : duration / steps;

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, stepDelay);

    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, steps, duration, delay, onComplete]);

  return {
    currentStep,
    isAnimating,
    startSequence,
    resetSequence
  };
}

export default useAnimationSequence;
