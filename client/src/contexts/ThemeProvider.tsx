import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext, type Theme, type ThemeContextType } from './ThemeContextDefinitions';

/**
 * Props for the ThemeProvider component
 */
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultHighContrast?: boolean;
}

/**
 * Theme provider component that handles theme state and persistence
 * for implementing Material 3 light and dark themes.
 */
export const ThemeProvider = ({ 
  children, 
  defaultTheme = 'light',
  defaultHighContrast = false
}: ThemeProviderProps) => {
  // Initialize theme from localStorage or system preference if available
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      return savedTheme as Theme;
    }
    
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Fall back to default theme
    return defaultTheme;
  });
  
  // Initialize high contrast mode from localStorage
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const savedHighContrast = localStorage.getItem('highContrast');
    return savedHighContrast === 'true' || defaultHighContrast;
  });

  // Update data-theme attribute on document when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Update data-high-contrast attribute when high contrast mode changes
  useEffect(() => {
    document.documentElement.setAttribute('data-high-contrast', highContrast.toString());
    localStorage.setItem('highContrast', highContrast.toString());
  }, [highContrast]);

  // Listen for system theme preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't explicitly chosen a theme
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Safari < 14 (using type casting for older browsers)
    else if ('addListener' in mediaQuery) {
      const mqWithLegacyListeners = mediaQuery as unknown as { 
        addListener(listener: (e: MediaQueryListEvent) => void): void;
        removeListener(listener: (e: MediaQueryListEvent) => void): void;
      };
      mqWithLegacyListeners.addListener(handleChange);
      return () => mqWithLegacyListeners.removeListener(handleChange);
    }
  }, []);
  
  // Toggle between light and dark themes
  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  
  // Toggle high contrast mode
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  
  // Create the context value object that conforms to ThemeContextType
  const contextValue: ThemeContextType = {
    theme,
    highContrast,
    toggleTheme,
    toggleHighContrast,
    setTheme,
    setHighContrast
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
