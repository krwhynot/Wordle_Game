/**
 * Dialog Component
 * 
 * A reusable dialog/modal component with accessibility features.
 * Provides backdrop, focus trapping, and keyboard navigation.
 */
import { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<Element | null>(null);

  // Handle backdrop click to close dialog
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Trap focus within the dialog
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    // Save the previously focused element
    previouslyFocusedElement.current = document.activeElement;

    // Find all focusable elements within the dialog
    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    } else {
      // If no focusable elements, focus the dialog itself
      dialog.focus();
    }

    // Handle tab key to trap focus
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab: If focus is on first element, move to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: If focus is on last element, move to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Handle escape key to close dialog
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
      
      // Restore body scrolling
      document.body.style.overflow = '';
      
      // Restore focus to previously focused element
      if (previouslyFocusedElement.current) {
        (previouslyFocusedElement.current as HTMLElement).focus();
      }
    };
  }, [isOpen, onClose]);

  // Don't render anything if dialog is not open
  if (!isOpen) return null;

  // Create portal for dialog
  return createPortal(
    <div 
      className="dialog-backdrop"
      onClick={handleBackdropClick}
      data-testid="dialog-backdrop"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={`dialog ${className}`}
        tabIndex={-1}
        data-testid="dialog"
      >
        <div className="dialog-header">
          <h2 id={ariaLabelledBy} className="dialog-title">{title}</h2>
          <button
            className="dialog-close"
            onClick={onClose}
            aria-label="Close dialog"
            data-testid="dialog-close"
          >
            ×
          </button>
        </div>
        <div className="dialog-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Dialog;
