import React from 'react';
import { X, Info, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

export default function Alert({ type = 'info', title, message, onDismiss, className = '' }) {
  const types = {
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500', icon: Info, iconColor: 'text-blue-400' },
    warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500', icon: AlertTriangle, iconColor: 'text-yellow-400' },
    error: { bg: 'bg-red-500/10', border: 'border-red-500', icon: AlertOctagon, iconColor: 'text-red-400' },
    success: { bg: 'bg-green-500/10', border: 'border-green-500', icon: CheckCircle, iconColor: 'text-green-400' }
  };

  const style = types[type] || types.info;
  const Icon = style.icon;

  return (
    <div className={`flex items-start p-4 mb-4 border-l-4 rounded-r-lg shadow-sm animate-slide-in-right ${style.bg} ${style.border} ${className}`} role="alert">
      <div className="flex-shrink-0">
        <Icon className={`h-5 w-5 ${style.iconColor}`} />
      </div>
      <div className="ml-3 flex-1">
        {title && <h3 className={`text-sm font-medium ${style.iconColor}`}>{title}</h3>}
        <div className="mt-1 text-sm text-gray-300">
          {message}
        </div>
      </div>
      {onDismiss && (
        <div className="ml-auto pl-3">
          <button
            type="button"
            className="inline-flex rounded-md p-1.5 text-gray-400 hover:bg-white/10 focus:outline-none"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
