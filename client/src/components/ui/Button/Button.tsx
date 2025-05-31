import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  const className = `button ${variant}`;
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;