"use client"
import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'], duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};