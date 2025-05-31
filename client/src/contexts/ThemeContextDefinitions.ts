import { createContext } from 'react';

// Type definition for themes
export type Theme = 'light' | 'dark';

// Theme context interface with state and setters
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Create the context with null as initial value
export const ThemeContext = createContext<ThemeContextType | null>(null);
