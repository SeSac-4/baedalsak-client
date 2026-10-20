import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

/** CMP-04 Card — 정보 묶음 컨테이너. interactive면 hover 강조(클릭 가능 카드만). */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

/**
 * 테두리·라운드·패딩을 가진 카드 컨테이너를 렌더링한다.
 * @param props 카드 속성 (interactive: hover 강조 여부)
 * @returns 카드 요소
 */
export function Card({ interactive = false, className, ...props }: CardProps): ReactNode {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface p-3.5',
        interactive && 'transition hover:border-role/40 hover:bg-surface-hover',
        className,
      )}
      {...props}
    />
  );
}
