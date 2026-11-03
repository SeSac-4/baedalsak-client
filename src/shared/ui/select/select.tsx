import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';
import { FIELD_CLASS } from '@/shared/ui/input';

export type SelectProps = ComponentProps<'select'>;

/**
 * 단일 선택 목록 (네이티브 select). 오른쪽에 펼침 화살표를 그린다.
 * @param props select 속성 (ref 포함), option은 children으로
 * @returns 선택 요소
 */
export function Select({ className, children, ...props }: SelectProps): ReactNode {
  return (
    <div className='relative w-full'>
      <select
        className={cn(FIELD_CLASS, 'appearance-none pr-10 read-only:bg-surface', className)}
        {...props}
      >
        {children}
      </select>
      <Icon
        name='chevron-down'
        size={18}
        className='pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-fg-muted'
      />
    </div>
  );
}
