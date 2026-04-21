import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastType } from '../components/Toast';

// トースト通知の型定義
export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// コンテキストの型定義
interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

// コンテキストの作成
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// トーストコンテキストプロバイダーのプロパティ
interface ToastProviderProps {
  children: ReactNode;
}

/**
 * トースト通知を管理するプロバイダーコンポーネント
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // トースト追加
  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  }, []);

  // トースト削除
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-16 right-8 z-50 flex flex-col space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * トースト通知を使用するためのカスタムフック
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
