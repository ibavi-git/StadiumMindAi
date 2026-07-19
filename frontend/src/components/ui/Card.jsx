import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  hover = false, 
  glow = null, 
  padding = 'md',
  animate = false
}) {
  const baseClasses = hover ? 'glass-card-hover' : 'glass-card';
  
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8'
  };

  const glows = {
    blue: 'shadow-[0_0_15px_rgba(0,61,165,0.3)] border-blue-500/30',
    green: 'shadow-[0_0_15px_rgba(0,165,80,0.3)] border-green-500/30',
    red: 'shadow-[0_0_15px_rgba(239,68,68,0.3)] border-red-500/30'
  };

  const glowClass = glow ? glows[glow] : '';
  const animClass = animate ? 'animate-fade-in' : '';

  return (
    <div className={`rounded-xl ${baseClasses} ${paddings[padding]} ${glowClass} ${animClass} ${className}`}>
      {children}
    </div>
  );
}
