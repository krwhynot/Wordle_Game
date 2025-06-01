import type { ReactNode } from 'react';
import { useEffect } from 'react';
import '../../styles/global.scss';

interface DialogProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  showCloseButton?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
}

/**
 * Dialog component for modal interfaces
 * following Material 3 design principles with a glass morphism effect.
 */
const Dialog = ({ 
  children, 
  isOpen, 
  onClose,
  title,
  className = '',
  showCloseButton = true,
  maxWidth = 'sm'
}: DialogProps) => {
  // Handle escape key press to close dialog
  useEffect(() => {
    const handleEscKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKeyPress);
    
    // Prevent scrolling when dialog is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscKeyPress);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Convert string maxWidth to CSS value
  const getMaxWidthValue = () => {
    if (typeof maxWidth === 'string') {
      if (['xs', 'sm', 'md', 'lg', 'xl'].includes(maxWidth)) {
        const sizes = {
          xs: '320px',
          sm: '480px',
          md: '600px',
          lg: '800px',
          xl: '1000px',
        };
        return sizes[maxWidth as keyof typeof sizes];
      }
      return maxWidth;
    }
    return '480px'; // Default
  };

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div 
        className={`dialog glass ${className}`} 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: getMaxWidthValue() }}
      >
        {(title || showCloseButton) && (
          <div className="dialog-header">
            {title && <h2 className="dialog-title">{title}</h2>}
            {showCloseButton && (
              <button 
                className="dialog-close-btn" 
                onClick={onClose}
                aria-label="Close dialog"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="dialog-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
