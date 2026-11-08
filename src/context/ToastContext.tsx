import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage } from '../types/auth.ts';
import { ShieldAlert, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type, title, message }: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'error':
        return <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
      case 'info':
        return <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />;
    }
  };

  const getBorderColor = (type: ToastMessage['type']) => {
    switch (type) {
      case 'error':
        return 'border-rose-300 bg-rose-50/95 text-rose-950 shadow-rose-900/10';
      case 'warning':
        return 'border-amber-300 bg-amber-50/95 text-amber-950 shadow-amber-900/10';
      case 'success':
        return 'border-emerald-300 bg-emerald-50/95 text-emerald-950 shadow-emerald-900/10';
      case 'info':
        return 'border-sky-300 bg-sky-50/95 text-sky-950 shadow-sky-900/10';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div 
        aria-live="assertive" 
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-200 animate-in slide-in-from-bottom-3 ${getBorderColor(
              toast.type
            )}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-bold tracking-tight">
                {toast.title}
              </h5>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
