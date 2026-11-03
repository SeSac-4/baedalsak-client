import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon, type IconName } from '@/shared/ui/icon';

/** 아이콘만 있는 정사각 버튼. secondary(테두리, 새로고침 등) · ghost(배경 없음, 닫기·빼기 등). md 44px · sm 36px */
const iconButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-control transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink disabled:cursor-not-allowed disabled:text-fg-disabled',
  {
    variants: {
      variant: {
        secondary: 'border border-border bg-surface text-fg hover:bg-surface-hover',
        ghost: 'text-fg-muted hover:bg-surface-hover hover:text-fg',
      },
      size: {
        sm: 'size-9',
        md: 'size-11',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
);

export interface IconButtonProps
  extends Omit<ComponentProps<'button'>, 'children' | 'aria-label'>, VariantProps<typeof iconButtonVariants> {
  icon: IconName;
  /** 스크린리더용 버튼 이름 (예: '새로고침') */
  label: string;
}

/**
 * 아이콘 버튼을 렌더링한다. 글자가 없으니 label을 aria-label로 꼭 붙인다.
 * @param props icon(아이콘 이름), label(버튼 이름), variant·size와 button 속성
 * @returns 버튼 요소
 */
export function IconButton({
  icon,
  label,
  variant,
  size,
  className,
  type = 'button',
  ...props
}: IconButtonProps): ReactNode {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      <Icon
        name={icon}
        size={size === 'sm' ? 18 : 20}
      />
    </button>
  );
}
