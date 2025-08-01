import React, { useEffect } from 'react';
import { CheckIcon, XIcon } from './icons';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 4000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          icon: 'text-emerald-400',
          progress: 'bg-emerald-500'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-400',
          progress: 'bg-red-500'
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'text-blue-400',
          progress: 'bg-blue-500'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className={`relative max-w-sm w-full ${styles.container} border rounded-lg shadow-lg p-4 animate-in`}>
      {/* Close button */}
      <button
        onClick={() => onClose(id)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Zatvoriť notifikáciu"
      >
        <XIcon />
      </button>

      {/* Content */}
      <div className="flex items-start gap-3 pr-6">
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {type === 'success' ? (
            <CheckIcon />
          ) : type === 'error' ? (
            <XIcon />
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          {message && (
            <p className="text-sm opacity-90 mt-1">{message}</p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10 rounded-b-lg overflow-hidden">
        <div 
          className={`h-full ${styles.progress} animate-progress`} 
          style={{
            '--duration': `${duration}ms`
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

export default Toast;