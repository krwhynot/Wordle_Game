/**
 * Theme Context Definitions
 * 
 * This file contains the type definitions and context creation for the theme system.
 * Separating these from the provider implementation helps with React Fast Refresh.
 */
import { createContext } from 'react';

/**
 * Available theme options
 */
export type Theme = 'light' | 'dark';

/**
 * Theme context interface
 */
export interface ThemeContextType {
  theme: Theme;
  highContrast: boolean;
  toggleTheme: () => void;
  toggleHighContrast: () => void;
  setTheme: (theme: Theme) => void;
  setHighContrast: (enabled: boolean) => void;
}

/**
 * Theme context with initial null value
 * The actual value will be provided by ThemeProvider
 */
export const ThemeContext = createContext<ThemeContextType | null>(null);
