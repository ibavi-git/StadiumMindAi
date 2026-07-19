import React from 'react';
import Spinner from './Spinner';

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  icon: Icon, 
  children, 
  onClick, 
  type = 'button', 
  className = '', 
  ...rest 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dash-bg disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500 shadow-sm',
    secondary: 'bg-white/10 hover:bg-white/20 text-white focus-visible:ring-white/50',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500 shadow-sm',
    ghost: 'hover:bg-white/10 text-white focus-visible:ring-white/50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      role="button"
      {...rest}
    >
      {loading && <Spinner size="sm" color="white" className="mr-2" />}
      {!loading && Icon && <Icon className={`mr-2 h-5 w-5 ${size === 'sm' ? 'h-4 w-4' : ''}`} />}
      {children}
    </button>
  );
}
