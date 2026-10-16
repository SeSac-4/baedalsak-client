import { forwardRef } from 'react';

import { cn } from '@/shared/lib/cn';

/** CMP-08 FormField(select) — 카테고리·운송수단 등 단일 선택. 네이티브 select 기반. */
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'h-9 w-full rounded-lg border border-border bg-surface px-3 text-body text-fg transition',
        'focus-visible:border-role focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-role/50',
        'disabled:opacity-40',
        'aria-[invalid=true]:border-warn aria-[invalid=true]:ring-warn/40',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = 'Select';
