import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/ui/icon-button';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** 제목 아래 보조 문구 (예: 주문 요약) */
  description?: ReactNode;
  children?: ReactNode;
  /** 아래 버튼 줄. 버튼들은 같은 너비로 나눈다 */
  footer?: ReactNode;
  /** 오버레이를 누르면 닫기 (기본 true) */
  closeOnOverlay?: boolean;
  className?: string;
}

/**
 * Tab 키 포커스를 패널 안에서만 돈다.
 * @param event - 키보드 이벤트
 * @param panel - 모달 패널
 */
const trapFocus = (event: KeyboardEvent, panel: HTMLElement): void => {
  const nodes = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
  if (nodes.length === 0) {
    event.preventDefault();
    return;
  }
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

/**
 * 가운데 모달 (확인·입력). role=dialog, ESC로 닫기, 포커스를 안에 가두고 닫으면 원래 자리로 돌려준다.
 * 너비는 최대 380px (넓은 폼은 className으로 max-w를 바꾼다).
 * @param props open, onClose, title, description, children, footer, closeOnOverlay, className
 * @returns 모달 요소 (닫혀 있으면 null)
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeOnOverlay = true,
  className,
}: ModalProps): ReactNode {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key === 'Tab' && panelRef.current) trapFocus(event, panelRef.current);
    };

    document.addEventListener('keydown', handleKeyDown, true);
    const target = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panelRef.current;
    target?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6'
      onMouseDown={(event) => {
        if (closeOnOverlay && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className='fixed inset-0 bg-overlay'
        aria-hidden
      />
      <div
        ref={panelRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 my-auto flex w-full max-w-[380px] flex-col gap-4 rounded-card bg-surface p-5 shadow-[0_16px_40px_rgb(0_0_0/0.2)] focus:outline-none',
          className,
        )}
      >
        <div className='flex items-start gap-2'>
          <div className='flex-1'>
            <h2
              id={titleId}
              className='text-title font-bold text-fg'
            >
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className='mt-0.5 text-note text-fg-muted'
              >
                {description}
              </p>
            ) : null}
          </div>
          <IconButton
            icon='close'
            label='닫기'
            variant='ghost'
            onClick={onClose}
            className='-mt-2.5 -mr-2.5'
          />
        </div>
        {children}
        {footer ? <div className='flex gap-2 *:flex-1'>{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
