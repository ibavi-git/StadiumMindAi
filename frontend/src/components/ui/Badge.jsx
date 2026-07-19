import React from 'react';

export default function Badge({ status, label, pulse = false }) {
  const normalized = (status || '').toString().toUpperCase();
  
  const colors = {
    CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/50',
    HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    MODERATE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    LOW: 'bg-green-500/20 text-green-400 border-green-500/50',
    RESTRICTED: 'bg-red-500/20 text-red-400 border-red-500/50',
    ACTIVE: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    RESOLVED: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
  };

  const defaultColor = 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  const colorClass = colors[normalized] || defaultColor;
  const pulseClass = (pulse || normalized === 'CRITICAL') ? 'animate-pulse-critical' : '';

  return (
    <span className={`status-pill ${colorClass} ${pulseClass}`}>
      {label || normalized}
    </span>
  );
}
