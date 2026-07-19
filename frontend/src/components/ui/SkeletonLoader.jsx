import React from 'react';

/**
 * SkeletonLoader — animated shimmer placeholder for loading states.
 *
 * Props:
 *   lines  — number of text lines to show (default: 3)
 *   height — Tailwind height class for each line (default: 'h-4')
 *   card   — if true, wraps in a card-style container
 */
export function SkeletonLine({ height = 'h-4', width = 'w-full', className = '' }) {
  return (
    <div className={`skeleton-shimmer rounded-md ${height} ${width} ${className}`} />
  );
}

export function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 ${className}`}>
      <SkeletonLine height="h-5" width="w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          height="h-3"
          width={i === lines - 1 ? 'w-4/6' : 'w-full'}
        />
      ))}
    </div>
  );
}

export function SkeletonInsightCard({ className = '' }) {
  return (
    <div className={`bg-white/5 border-l-2 border-l-white/20 rounded-lg p-4 space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <SkeletonLine height="h-5" width="w-20" />
        <SkeletonLine height="h-4" width="w-12" />
      </div>
      <SkeletonLine height="h-3" width="w-1/3" />
      <SkeletonLine height="h-3" width="w-full" />
      <SkeletonLine height="h-3" width="w-5/6" />
      <div className="mt-2 bg-black/20 rounded p-2">
        <SkeletonLine height="h-3" width="w-3/4" />
      </div>
    </div>
  );
}

export function SkeletonMetricBar({ className = '' }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
          <SkeletonLine height="h-3" width="w-2/3" />
          <SkeletonLine height="h-8" width="w-1/2" />
          <SkeletonLine height="h-2" width="w-full" />
        </div>
      ))}
    </div>
  );
}

export default SkeletonCard;
