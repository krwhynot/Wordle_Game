import { vi } from 'vitest';

/**
 * Responsive testing utility to simulate different screen sizes
 */
export const VIEWPORT_SIZES = {
  MOBILE: { width: 320, height: 568 }, // iPhone SE
  TABLET: { width: 768, height: 1024 }, // iPad
  DESKTOP: { width: 1280, height: 800 } // Standard desktop
};

/**
 * Sets up the viewport size for responsive testing
 * @param width - The viewport width
 * @param height - The viewport height
 */
export function setViewportSize(width: number, height: number) {
  // Store the original window dimensions
  const originalWidth = window.innerWidth;
  const originalHeight = window.innerHeight;

  // Update window dimensions
  Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
  Object.defineProperty(window, 'innerHeight', { value: height, writable: true });

  // Trigger a resize event
  window.dispatchEvent(new Event('resize'));

  // Return a cleanup function to restore original dimensions
  return () => {
    Object.defineProperty(window, 'innerWidth', { value: originalWidth, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: originalHeight, writable: true });
    window.dispatchEvent(new Event('resize'));
  };
}

/**
 * Mocks the window.getComputedStyle function for testing CSS
 * @param styles - CSS property values to mock
 */
export function mockComputedStyle(styles: Partial<CSSStyleDeclaration>) {
  const originalGetComputedStyle = window.getComputedStyle;

  const mockGetComputedStyle = vi.fn((element: Element) => {
    const originalStyles = originalGetComputedStyle(element);
    return {
      ...originalStyles,
      ...styles,
      getPropertyValue: (prop: string) => {
        // @ts-ignore - Return the mocked value or fall back to the original
        return styles[prop] !== undefined ? styles[prop] : originalStyles.getPropertyValue(prop);
      }
    };
  });

  window.getComputedStyle = mockGetComputedStyle;

  return () => {
    window.getComputedStyle = originalGetComputedStyle;
  };
}

/**
 * Creates a mock ResizeObserver for testing responsive components
 */
export function mockResizeObserver() {
  const originalResizeObserver = window.ResizeObserver;

  // Mock implementation
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }));

  return () => {
    window.ResizeObserver = originalResizeObserver;
  };
}

/**
 * Checks if an element meets the minimum touch target size requirements
 * @param element - The DOM element to check
 * @param minSize - Minimum size in pixels (default: 44px as per accessibility guidelines)
 */
export function checkTouchTargetSize(element: Element, minSize = 44) {
  const styles = window.getComputedStyle(element);
  const width = parseFloat(styles.width);
  const height = parseFloat(styles.height);

  return {
    meetsMinimumWidth: width >= minSize,
    meetsMinimumHeight: height >= minSize,
    width,
    height
  };
}
