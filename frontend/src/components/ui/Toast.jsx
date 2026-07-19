import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Toast notification component.
 * Variants: success | error | warning | info
 */
const TOAST_STYLES = {
  success: {
    container: 'bg-green-900/90 border-green-500/50 text-green-100',
    icon: <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />,
  },
  error: {
    container: 'bg-red-900/90 border-red-500/50 text-red-100',
    icon: <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />,
  },
  warning: {
    container: 'bg-orange-900/90 border-orange-500/50 text-orange-100',
    icon: <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0" />,
  },
  info: {
    container: 'bg-blue-900/90 border-blue-500/50 text-blue-100',
    icon: <Info className="h-5 w-5 text-blue-400 flex-shrink-0" />,
  },
};

export function Toast({ id, message, variant = 'info', onDismiss }) {
  const style = TOAST_STYLES[variant] || TOAST_STYLES.info;

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl
        max-w-sm w-full animate-slide-in-right
        ${style.container}
      `}
      role="alert"
    >
      {style.icon}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="opacity-60 hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Toast container — renders all active toasts in the bottom-right corner.
 */
export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            message={toast.message}
            variant={toast.variant}
            onDismiss={onDismiss}
          />
        </div>
      ))}
    </div>
  );
}

export default Toast;
