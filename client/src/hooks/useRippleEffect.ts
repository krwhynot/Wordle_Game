import { useCallback } from 'react';

/**
 * Custom hook to add Material 3 ripple effect to clickable elements
 * @returns Event handler to attach to element's onClick
 */
const useRippleEffect = () => {
  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    
    // Check if button already has ripple-container class
    if (!button.classList.contains('ripple-container')) {
      button.classList.add('ripple-container');
    }
    
    // Remove any existing ripples
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }
    
    // Create new ripple element
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    // Get click coordinates relative to the button
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;
    
    // Set ripple position and size
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.classList.add('ripple');
    
    // Add ripple to button
    button.appendChild(circle);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      if (circle && circle.parentNode) {
        circle.parentNode.removeChild(circle);
      }
    }, 600); // Match to ripple animation duration
  }, []);
  
  return createRipple;
};

export default useRippleEffect;
