import type { ReactNode } from 'react';
import '../../styles/global.scss';

interface AppBarProps {
  title: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  className?: string;
  elevation?: boolean;
  transparent?: boolean;
}

/**
 * AppBar component for the application header
 * following Material 3 design principles with options for
 * transparency and elevation.
 */
const AppBar = ({ 
  title, 
  leftAction, 
  rightAction, 
  className = '',
  elevation = true,
  transparent = false
}: AppBarProps) => {
  const appBarClasses = [
    'app-bar',
    'flex-between',
    elevation ? 'elevation-1' : '',
    transparent ? 'app-bar-transparent' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <header className={appBarClasses}>
      <div className="app-bar-left">
        {leftAction}
      </div>
      
      <h1 className="app-bar-title">{title}</h1>
      
      <div className="app-bar-right">
        {rightAction}
      </div>
    </header>
  );
};

export default AppBar;
