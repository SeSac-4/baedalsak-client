import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface SwitchProps extends Omit<ComponentProps<'button'>, 'onChange' | 'children' | 'role' | 'aria-label'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** 스크린리더용 이름 (예: '정상 운영') */
  label: string;
}

/**
 * 켜기·끄기 스위치 (운영 상태·판매 상태). 누르는 영역은 60×44px, 켜지면 역할색.
 * @param props checked(켜짐 여부), onCheckedChange, label과 button 속성
 * @returns 스위치 요소
 */
export function Switch({ checked, onCheckedChange, label, className, ...props }: SwitchProps): ReactNode {
  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'inline-flex h-11 w-15 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'relative block h-7.5 w-13 rounded-full transition-colors',
          checked ? 'bg-role' : 'bg-border-strong',
        )}
      >
        <span
          className={cn(
            'absolute top-0.75 left-0.75 size-6 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.25)] transition-transform',
            checked && 'translate-x-5.5',
          )}
        />
      </span>
    </button>
  );
}
