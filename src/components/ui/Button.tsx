import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button' | 'a';
  to?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ as = 'button', to, variant = 'primary', size = 'default', children, className, ...props }) => {
  const baseStyles = 'font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 inline-flex items-center justify-center';

  const variantStyles = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
    outline: 'bg-transparent border-2 border-emerald-400 text-emerald-300 hover:bg-emerald-500 hover:text-white',
  };

  const sizeStyles = {
    default: 'px-6 py-3',
    sm: 'px-3 py-1.5 text-sm',
    lg: 'px-8 py-4 text-lg',
  };

  const shape = 'rounded-full';

  const combinedClassName = [baseStyles, variantStyles[variant], sizeStyles[size], shape, className].filter(Boolean).join(' ');

  if (as === 'a' && to) {
    return (
      <Link to={to} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
