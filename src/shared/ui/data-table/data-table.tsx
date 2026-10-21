import type { ReactNode, TableHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

/**
 * CMP-14 DataTable — 표 스타일 + 가로 스크롤 래퍼(표만 overflow-x).
 * thead/tbody는 children으로 받는다. 숫자 열은 셀에 text-right를 준다.
 */
export interface DataTableProps extends TableHTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
}

/**
 * 테두리·헤더·행 구분선을 가진 표를 렌더링한다.
 * @param props 표 속성 (wrapperClassName: 스크롤 래퍼 클래스)
 * @returns 표 요소
 */
export function DataTable({ wrapperClassName, className, children, ...props }: DataTableProps): ReactNode {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-border bg-surface', wrapperClassName)}>
      <table
        className={cn(
          'w-full border-collapse text-body tabular-nums',
          '[&_th]:border-b [&_th]:border-border [&_th]:bg-surface-hover [&_th]:px-3 [&_th]:py-2 [&_th]:text-note [&_th]:font-medium [&_th]:whitespace-nowrap [&_th]:text-fg-muted [&_th:not(.text-right)]:text-left',
          '[&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:py-2.5 [&_td]:align-middle [&_td]:text-fg',
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
