import { createContext, useContext, type ReactNode } from 'react';

/** default: 안내·오류 · success: 체크 아이콘을 붙인 완료 알림 */
export type ToastTone = 'default' | 'success';

export type ShowToast = (message: ReactNode, tone?: ToastTone) => void;

export interface ToastContextValue {
  toast: ShowToast;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * 토스트를 띄우는 함수를 돌려준다. <ToastProvider> 안에서 호출한다.
 * @returns 메시지(와 톤)를 받아 하단에 토스트를 띄우는 함수
 */
export const useToast = (): ShowToast => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within <ToastProvider>');
  return context.toast;
};
