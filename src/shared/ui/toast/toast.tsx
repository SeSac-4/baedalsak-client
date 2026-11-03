import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '@/shared/ui/icon';

import { ToastContext, type ToastTone } from './toast-context';

interface ToastItem {
  id: number;
  message: ReactNode;
  tone: ToastTone;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** 자동 숨김 시간(ms). 기본 1800 */
  duration?: number;
}

/**
 * 짧은 결과 알림. 하단 가운데에 어두운 상자로 띄우고 duration 뒤 자동으로 숨긴다(role=status).
 * 앱을 감싸고 useToast()로 호출한다.
 * @param props children, duration
 * @returns 토스트 컨텍스트와 토스트 영역
 */
export function ToastProvider({ children, duration = 1800 }: ToastProviderProps): ReactNode {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef<number>(0);

  /**
   * 토스트를 추가하고 duration 뒤 지운다.
   * @param message - 알림 문구
   * @param tone - 톤 (기본 default)
   */
  const addToast = (message: ReactNode, tone: ToastTone = 'default'): void => {
    idRef.current += 1;
    const id = idRef.current;
    setItems((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setItems((prev) => prev.filter((item) => item.id !== id)), duration);
  };

  return (
    <ToastContext value={{ toast: addToast }}>
      {children}
      {createPortal(
        <div
          role='status'
          aria-live='polite'
          className='pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4'
        >
          {items.map((item) => (
            <div
              key={item.id}
              className='pointer-events-auto flex w-full max-w-[420px] items-center gap-2.5 rounded-xl bg-fg px-4 py-3 text-body text-canvas shadow-[0_8px_24px_rgb(0_0_0/0.18)]'
            >
              {item.tone === 'success' ? (
                <Icon
                  name='check'
                  size={18}
                  strokeWidth={2.2}
                  className='shrink-0'
                />
              ) : null}
              <span>{item.message}</span>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext>
  );
}
