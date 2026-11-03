import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import { FIELD_CLASS } from './field-class';

export interface InputProps extends ComponentProps<'input'> {
  /** 입력칸 오른쪽 단위 (예: '원', '분') */
  suffix?: ReactNode;
}

/**
 * 한 줄 입력칸. 라벨·오류 문구는 폼이 조립하고, 검증 오류는 aria-invalid로 표시한다.
 * @param props suffix(단위)와 input 속성 (ref 포함)
 * @returns 입력 요소
 */
export function Input({ suffix, className, ...props }: InputProps): ReactNode {
  if (suffix === undefined) {
    return (
      <input
        className={cn(FIELD_CLASS, className)}
        {...props}
      />
    );
  }

  return (
    <div className='relative w-full'>
      <input
        className={cn(FIELD_CLASS, 'pr-9', className)}
        {...props}
      />
      <span
        aria-hidden
        className='pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-fg-muted'
      >
        {suffix}
      </span>
    </div>
  );
}
