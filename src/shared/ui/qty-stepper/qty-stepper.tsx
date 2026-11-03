import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

export interface QtyStepperProps {
  value: number;
  /** 스크린리더용 대상 이름 (예: 메뉴명) */
  label: string;
  min?: number;
  /** true면 −·+ 모두 막는다 (요청 중 등) */
  disabled?: boolean;
  onDecrease?: () => void;
  onIncrease?: () => void;
  className?: string;
}

const BUTTON_CLASS =
  'flex size-11 items-center justify-center rounded-control text-fg transition hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink disabled:cursor-not-allowed disabled:text-fg-disabled disabled:hover:bg-transparent';

/**
 * 수량 줄이기·표시·늘리기 묶음 (버튼 44px). 최소 수량이면 줄이기를 막는다.
 * @param props value(현재 수량), label(대상 이름), min(최소 수량), disabled(모두 막기), onDecrease, onIncrease
 * @returns 수량 조절 요소
 */
export function QtyStepper({
  value,
  label,
  min = 1,
  disabled = false,
  onDecrease,
  onIncrease,
  className,
}: QtyStepperProps): ReactNode {
  return (
    <div className={cn('inline-flex items-center rounded-control border border-border bg-surface', className)}>
      <button
        type='button'
        aria-label={`${label} 수량 줄이기`}
        disabled={disabled || value <= min}
        onClick={onDecrease}
        className={BUTTON_CLASS}
      >
        <Icon
          name='minus'
          size={16}
          strokeWidth={2.2}
        />
      </button>
      <span
        aria-live='polite'
        className='min-w-7 text-center font-bold text-fg tabular-nums'
      >
        {value}
      </span>
      <button
        type='button'
        aria-label={`${label} 수량 늘리기`}
        disabled={disabled}
        onClick={onIncrease}
        className={BUTTON_CLASS}
      >
        <Icon
          name='plus'
          size={16}
          strokeWidth={2.2}
        />
      </button>
    </div>
  );
}
