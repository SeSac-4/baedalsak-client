import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { ToastContext } from './toast-context';

/**
 * CMP-16 Toast — 짧은 결과 알림. 1.8초 자동 숨김, 하단 중앙 고정, role=status.
 * <ToastProvider>로 앱을 감싸고 useToast()로 호출한다.
 */
interface ToastItem {
  id: number;
  message: ReactNode;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** 자동 숨김 시간(ms). 기본 1800. */
  duration?: number;
}

export function ToastProvider({ children, duration = 1800 }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback(
    (message: ReactNode) => {
      const id = (idRef.current += 1);
      setItems((prev) => [...prev, { id, message }]);
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), duration);
    },
    [duration],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext value={value}>
      {children}
      {createPortal(
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4"
        >
          {items.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto max-w-[90vw] rounded-lg bg-fg px-4 py-2 text-note text-canvas shadow-lg"
            >
              {t.message}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext>
  );
}
