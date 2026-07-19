import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function EmergencyButton({ onClick, disabled }) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const holdDuration = 1500; // 1.5 seconds

  useEffect(() => {
    return () => {
      clearTimeout(holdTimerRef.current);
      clearInterval(progressTimerRef.current);
    };
  }, []);

  const handleStart = () => {
    if (disabled) return;
    setIsHolding(true);
    setProgress(0);
    
    // Start progress animation
    const startTime = Date.now();
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(p);
      if (p >= 100) clearInterval(progressTimerRef.current);
    }, 50);

    // Trigger action after duration
    holdTimerRef.current = setTimeout(() => {
      if (onClick) onClick();
      resetState();
    }, holdDuration);
  };

  const handleEnd = () => {
    resetState();
  };

  const resetState = () => {
    setIsHolding(false);
    setProgress(0);
    clearTimeout(holdTimerRef.current);
    clearInterval(progressTimerRef.current);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <button
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        disabled={disabled}
        className={`relative group rounded-full p-8 transition-transform ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
        aria-label="Hold to activate emergency response"
        role="button"
      >
        {/* Background pulse effect */}
        {!disabled && !isHolding && (
          <div className="absolute inset-0 rounded-full bg-red-600/30 animate-pulse-critical pointer-events-none"></div>
        )}
        
        {/* Progress ring SVG */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
          {isHolding && (
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#ef4444" // red-500
              strokeWidth="8"
              strokeDasharray="289" // 2 * pi * 46
              strokeDashoffset={289 - (289 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          )}
        </svg>

        {/* Main button circle */}
        <div className={`relative z-10 rounded-full h-32 w-32 flex items-center justify-center shadow-lg transition-colors ${
          disabled ? 'bg-gray-700' : isHolding ? 'bg-red-700' : 'bg-red-600'
        }`}>
          <ShieldAlert className="h-16 w-16 text-white" />
        </div>
      </button>
      
      <p className={`mt-4 text-sm font-medium transition-opacity ${isHolding ? 'text-red-400 opacity-100' : 'text-gray-400 opacity-70'}`}>
        {disabled ? 'Emergency system currently engaged' : 'Hold for 1.5s to generate AI response'}
      </p>
    </div>
  );
}
