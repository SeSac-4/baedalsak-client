import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface ProgressBarProps {
  value: number;
  max: number;
  /** 스크린리더용 이름 (예: '최소주문금액 채움') */
  label: string;
  /** role 역할색(기본) · warn 주황(아직 모자람) */
  tone?: 'role' | 'warn';
  className?: string;
}

/**
 * 얇은 진행 막대 (최소주문금액 채움 정도 등). value가 max를 넘으면 가득 찬다.
 * @param props value, max, label, tone, className
 * @returns 진행 막대 요소
 */
export function ProgressBar({ value, max, label, tone = 'role', className }: ProgressBarProps): ReactNode {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      role='progressbar'
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(value, max)}
      className={cn('h-1.5 overflow-hidden rounded-full bg-surface-hover', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width]', tone === 'warn' ? 'bg-warn' : 'bg-role')}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
