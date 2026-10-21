import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

/** CMP-11 QtyStepper — − 수량 + (버튼 28×28). 최소값이면 − 비활성. */
export interface QtyStepperProps {
  value: number;
  /** 스크린리더용 대상 이름 (예: 메뉴명) */
  label: string;
  min?: number;
  onDecrease?: () => void;
  onIncrease?: () => void;
  className?: string;
}

const BUTTON_CLASS =
  'flex size-7 items-center justify-center rounded-md text-body text-fg transition hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-role/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40';

/**
 * 수량 감소·표시·증가 버튼 묶음을 렌더링한다.
 * @param props value(현재 수량), label(대상 이름), min(최소 수량), onDecrease, onIncrease
 * @returns 수량 조절 요소
 */
export function QtyStepper({ value, label, min = 1, onDecrease, onIncrease, className }: QtyStepperProps): ReactNode {
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-lg border border-border p-0.5', className)}>
      <button
        type='button'
        aria-label={`${label} 수량 빼기`}
        disabled={value <= min}
        onClick={onDecrease}
        className={BUTTON_CLASS}
      >
        −
      </button>
      <span
        aria-live='polite'
        className='min-w-6 text-center text-body text-fg tabular-nums'
      >
        {value}
      </span>
      <button
        type='button'
        aria-label={`${label} 수량 더하기`}
        onClick={onIncrease}
        className={BUTTON_CLASS}
      >
        +
      </button>
    </div>
  );
}
