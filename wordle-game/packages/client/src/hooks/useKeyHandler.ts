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

    // For letter keys (single character), normalize to uppercase
    if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
      setLastKeyPressed(key.toUpperCase());
      onKeyDown?.(key.toUpperCase());
    }
    // For special keys (Backspace, Enter), pass as is if in allowed keys
    else if (allowedKeys.includes(key)) {
      setLastKeyPressed(key);
      onKeyDown?.(key);
    }
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
