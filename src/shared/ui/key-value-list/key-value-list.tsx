import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface KeyValueItem {
  label: string;
  value: ReactNode;
}

export interface KeyValueListProps {
  items: KeyValueItem[];
  /** plain: 라벨 회색 + 값 · boxed: 회색 상자 안 메모(요청사항 등) */
  variant?: 'plain' | 'boxed';
  /** body 14.5px(기본) · note 12.5px(목록 카드 안) */
  size?: 'body' | 'note';
  /** 라벨 칸 너비 px (기본 88) */
  labelWidth?: number;
  className?: string;
}

/**
 * 라벨·값 쌍 목록을 dl로 렌더링한다. 라벨 칸 너비는 고정, 값은 줄바꿈한다.
 * @param props items(라벨·값 목록), variant, size, labelWidth, className
 * @returns 정의 목록 요소
 */
export function KeyValueList({
  items,
  variant = 'plain',
  size = 'body',
  labelWidth = 88,
  className,
}: KeyValueListProps): ReactNode {
  const isBoxed = variant === 'boxed';

  return (
    <dl
      className={cn(
        'grid',
        size === 'note' ? 'text-note' : 'text-body',
        isBoxed ? 'gap-x-2 gap-y-1 rounded-control bg-surface-hover px-3 py-2.5' : 'gap-x-3 gap-y-1.5',
        className,
      )}
      style={{ gridTemplateColumns: `${labelWidth}px minmax(0, 1fr)` }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className='contents'
        >
          <dt className={cn('text-fg-muted', isBoxed && 'text-note font-semibold')}>{item.label}</dt>
          <dd className='break-words text-fg'>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
