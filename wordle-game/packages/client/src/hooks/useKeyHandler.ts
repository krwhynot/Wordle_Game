import { useEffect, useCallback, useState } from 'react';

interface KeyHandlerOptions {
  onKeyDown?: (key: string) => void;
  isEnabled?: boolean;
  allowedKeys?: string[];
}

function useKeyHandler({
  onKeyDown,
  isEnabled = true,
  allowedKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                 'Backspace', 'Enter']
}: KeyHandlerOptions) {
  // Track pressed keys for virtual keyboard synchronization
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  // Handle physical keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isEnabled) return;

    const key = event.key;

    // Determine if the key is a letter
    const isLetter = key.length === 1 && /^[a-zA-Z]$/.test(key);
    const normalizedKey = isLetter ? key.toUpperCase() : key;

    // Check if the key is allowed. If it's a letter, check its uppercase version.
    if (!allowedKeys.includes(normalizedKey)) {
      return;
    }

    setLastKeyPressed(normalizedKey);
    onKeyDown?.(normalizedKey);
  }, [isEnabled, onKeyDown, allowedKeys]);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Function to handle virtual keyboard presses
  const handleVirtualKeyPress = useCallback((key: string) => {
    if (!isEnabled) return;

    setLastKeyPressed(key);
    onKeyDown?.(key);
  }, [isEnabled, onKeyDown]);

  return {
    lastKeyPressed,
    handleVirtualKeyPress
  };
}

export default useKeyHandler;
