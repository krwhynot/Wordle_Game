import type { ReactNode } from 'react';
import '../../styles/global.scss';

interface CardProps {
  children: ReactNode;
  className?: string;
  elevation?: 1 | 2 | 3 | 4 | 5;
  onClick?: () => void;
}

/**
 * Card component that provides a surface with elevation
 * following Material 3 design principles.
 */
const Card = ({ 
  children, 
  className = '', 
  elevation = 1,
  onClick
}: CardProps) => {
  return (
    <div 
      className={`card elevation-${elevation} ${className}`}
      onClick={onClick}
      style={{ boxShadow: `var(--elevation-${elevation})` }}
    >
      {children}
    </div>
  );
};

export default Card;
