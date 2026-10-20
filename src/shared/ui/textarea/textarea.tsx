import { forwardRef } from 'react';

import { cn } from '@/shared/lib/cn';

/** CMP-08 FormField(textarea) — 요청사항 등 여러 줄 입력. */
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, rows = 3, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(
      'w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-body text-fg transition',
      'placeholder:text-fg-subtle',
      'focus-visible:border-role focus-visible:ring-2 focus-visible:ring-role/50 focus-visible:outline-none',
      'read-only:bg-surface-hover disabled:opacity-40',
      'aria-[invalid=true]:border-warn aria-[invalid=true]:ring-warn/40',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
