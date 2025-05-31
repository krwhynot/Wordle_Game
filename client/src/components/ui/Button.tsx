import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import useRippleEffect from '../../hooks/useRippleEffect';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

/**
 * Material 3 style Button component with ripple effect
 */
const Button = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  className = '',
  onClick,
  ...props 
}: ButtonProps) => {
  // Get ripple effect handler
  const createRipple = useRippleEffect();
  
  // Handle click with ripple effect
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    onClick?.(event);
  };
  
  // Generate class names
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full-width' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button 
      className={buttonClasses}
      onClick={handleClick}
      {...props}
    >
      {startIcon && <span className="btn-icon-start">{startIcon}</span>}
      <span className="btn-text">{children}</span>
      {endIcon && <span className="btn-icon-end">{endIcon}</span>}
    </button>
  );
};

export default Button;
