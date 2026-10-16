import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

/** CMP-07 Button — primary(역할색 채움) · secondary(테두리) · size sm/md/lg · block */
const button = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-role/50 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'bg-role text-white hover:brightness-110',
        secondary: 'border border-border bg-surface text-fg hover:bg-surface-hover',
        ghost: 'text-fg hover:bg-surface-hover',
        danger: 'bg-warn text-white hover:brightness-110',
      },
      size: {
        sm: 'h-7 px-2.5 text-note', // 28px — 보조 동작에만
        md: 'h-9 px-4 text-body', // 36px — 최소 터치 타겟
        lg: 'h-11 px-5 text-body', // 44px — 모바일 주 CTA
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', block: false },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={cn(button({ variant, size, block }), className)} {...props} />
  ),
);
Button.displayName = 'Button';
