import { createContext, useContext, type ReactNode } from 'react';

export interface ToastContextValue {
  toast: (message: ReactNode) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

/** <ToastProvider> 안에서 호출. 메시지를 넣으면 하단 중앙에 토스트가 뜬다. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx.toast;
}
