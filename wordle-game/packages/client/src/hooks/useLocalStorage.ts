import { useState, useEffect } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: { serialize?: (value: T) => string; deserialize?: (value: string) => T } = {}
): [T, (value: T | ((val: T) => T)) => void] {

  // Custom serialization/deserialization or defaults
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options;

  // Function to get initial value from localStorage or use provided initial value
  const getInitialValue = () => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        return deserialize(storedValue);
      }
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  };

  // State to hold the current value
  const [value, setValue] = useState<T>(getInitialValue);

  // Update localStorage when the state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, serialize(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, serialize, value]);

  return [value, setValue];
}

export default useLocalStorage;
