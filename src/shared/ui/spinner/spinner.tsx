import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface SpinnerProps {
  /** 지름 px (기본 20) */
  size?: number;
  /** 스크린리더용 상태 문구 */
  label?: string;
  className?: string;
}

/**
 * 불러오는 중 표시. role=status와 aria-label로 상태를 알린다.
 * @param props size, label, className
 * @returns 스피너 요소
 */
export function Spinner({ size = 20, label = '불러오는 중', className }: SpinnerProps): ReactNode {
  return (
    <span
      role='status'
      aria-label={label}
      style={{ width: size, height: size }}
      className={cn(
        'inline-block shrink-0 animate-spin rounded-full border-2 border-track border-t-role align-[-0.125em] motion-reduce:animate-[spin_3s_linear_infinite]',
        className,
      )}
    />
  );
}
