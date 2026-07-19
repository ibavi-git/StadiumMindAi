import React from 'react';

export default function Spinner({ size = 'md', color = 'blue', label = 'Loading...', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const colors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    white: 'text-white'
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`} role="status" aria-label={label}>
      <svg className={`animate-spin ${sizes[size]} ${colors[color]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}
