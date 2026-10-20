import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/shared/lib/cn';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * CMP-17 Modal / Dialog — 토스 결제창·확인 모달. role=dialog + ESC 닫기 + 포커스 트랩.
 * 화면 중앙, max-width 380, 좌우 16px 패딩. 오버레이 클릭으로 닫기(옵션).
 */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  closeOnOverlay?: boolean;
}

export function Modal({ open, onClose, title, children, footer, className, closeOnOverlay = true }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const nodes = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown, true);
    const target = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panelRef.current;
    target?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center px-4'
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className='absolute inset-0 bg-[var(--overlay)]'
        aria-hidden
      />
      <div
        ref={panelRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-w-[380px] rounded-xl border border-border bg-surface p-5 shadow-xl focus:outline-none',
          className,
        )}
      >
        {title ? (
          <div className='mb-3 flex items-start justify-between gap-3'>
            <h3
              id={titleId}
              className='text-body font-bold text-fg'
            >
              {title}
            </h3>
            <button
              type='button'
              aria-label='닫기'
              onClick={onClose}
              className='-m-1 rounded p-1 text-fg-subtle transition hover:text-fg focus-visible:ring-2 focus-visible:ring-role/50 focus-visible:outline-none'
            >
              ✕
            </button>
          </div>
        ) : null}
        <div className='text-body text-fg'>{children}</div>
        {footer ? <div className='mt-5 flex justify-end gap-2'>{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
