import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

/** CMP-13 KeyValueList — 라벨 110px 고정 + 값 줄바꿈. */
export interface KeyValueItem {
  label: string;
  value: ReactNode;
}

export interface KeyValueListProps {
  items: KeyValueItem[];
  className?: string;
}

/**
 * 라벨·값 쌍 목록을 dl로 렌더링한다.
 * @param props items(라벨·값 목록), className
 * @returns 정의 목록 요소
 */
export function KeyValueList({ items, className }: KeyValueListProps): ReactNode {
  return (
    <dl className={cn('grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-body', className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className='contents'
        >
          <dt className='text-fg-muted'>{item.label}</dt>
          <dd className='break-words text-fg'>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
