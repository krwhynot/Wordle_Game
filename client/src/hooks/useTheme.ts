import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContextDefinitions';
import type { ThemeContextType } from '../contexts/ThemeContextDefinitions';

/**
 * Hook for consuming the ThemeContext
 * 
 * Provides access to theme state and methods for toggling theme and high contrast mode
 * @returns ThemeContextType object with theme state and methods
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
