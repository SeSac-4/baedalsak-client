import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface DataTableProps extends ComponentProps<'table'> {
  wrapperClassName?: string;
}

/**
 * 표 + 가로 스크롤 래퍼(표만 넘친다). thead·tbody는 children으로 받고, 숫자 열은 셀에 text-right를 준다.
 * @param props wrapperClassName(스크롤 래퍼 클래스)과 table 속성
 * @returns 표 요소
 */
export function DataTable({ wrapperClassName, className, children, ...props }: DataTableProps): ReactNode {
  return (
    <div className={cn('overflow-x-auto rounded-card border border-border bg-surface', wrapperClassName)}>
      <table
        className={cn(
          'w-full border-collapse text-body tabular-nums',
          '[&_th]:border-b [&_th]:border-border [&_th]:bg-surface-hover [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-note [&_th]:font-semibold [&_th]:whitespace-nowrap [&_th]:text-fg-muted [&_th:not(.text-right)]:text-left',
          '[&_td]:border-b [&_td]:border-border [&_td]:px-4 [&_td]:py-3 [&_td]:align-middle [&_td]:text-fg',
          '[&_tbody_tr:last-child_td]:border-b-0',
          className,
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}
