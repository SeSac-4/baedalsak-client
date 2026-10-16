import { forwardRef } from 'react';

import { cn } from '@/shared/lib/cn';

/**
 * CMP-08 FormField(입력) — 라벨/오류 레이아웃은 상위 폼이 조립하고,
 * 여기서는 제어 요소만 스타일링한다. 검증 오류는 aria-invalid="true"로 표시.
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-9 w-full rounded-lg border border-border bg-surface px-3 text-body text-fg transition',
      'placeholder:text-fg-subtle',
      'focus-visible:border-role focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-role/50',
      'disabled:opacity-40 read-only:bg-surface-hover',
      'aria-[invalid=true]:border-warn aria-[invalid=true]:ring-warn/40',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';
