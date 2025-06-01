import type { ReactNode } from 'react';
import '../../styles/global.scss';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  fluid?: boolean;
}

/**
 * Container component that provides consistent padding and maximum width
 * following Material 3 layout guidelines.
 */
const Container = ({ children, className = '', fluid = false }: ContainerProps) => {
  const containerClass = fluid 
    ? 'container-fluid' 
    : 'container';

  return (
    <div className={`${containerClass} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
