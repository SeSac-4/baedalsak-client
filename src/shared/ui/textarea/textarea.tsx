import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { FIELD_CLASS } from '@/shared/ui/input';

export type TextareaProps = ComponentProps<'textarea'>;

/**
 * 여러 줄 입력칸 (요청사항·메뉴 설명 등). 세로로만 크기를 바꿀 수 있다.
 * @param props textarea 속성 (ref 포함, rows 기본 3)
 * @returns 여러 줄 입력 요소
 */
export function Textarea({ className, rows = 3, ...props }: TextareaProps): ReactNode {
  return (
    <textarea
      rows={rows}
      className={cn(FIELD_CLASS, 'h-auto resize-y py-3 leading-[1.55]', className)}
      {...props}
    />
  );
}
