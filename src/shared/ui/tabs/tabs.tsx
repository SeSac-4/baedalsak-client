import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface TabItem {
  value: string;
  label: string;
  /** 탭 옆 개수 (없으면 숨김) */
  count?: number;
  /** 개수를 역할색으로 강조 (예: 신규 주문) */
  isEmphasized?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  /** 스크린리더용 탭 묶음 이름 (예: '주문 상태') */
  label: string;
  className?: string;
}

/**
 * 세그먼트 탭. 회색 바탕 위에 고른 칸만 흰색으로 띄운다. 제어형.
 * @param props items(탭 목록), value(선택 값), onChange, label(묶음 이름), className
 * @returns 탭 목록 요소
 */
export function Tabs({ items, value, onChange, label, className }: TabsProps): ReactNode {
  return (
    <div
      role='tablist'
      aria-label={label}
      className={cn('grid gap-1 rounded-xl bg-track p-1', className)}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => {
        const isSelected = item.value === value;
        return (
          <button
            key={item.value}
            type='button'
            role='tab'
            aria-selected={isSelected}
            onClick={() => onChange(item.value)}
            className={cn(
              'flex h-11 items-center justify-center gap-1.5 rounded-[9px] text-body transition',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink',
              isSelected
                ? 'bg-surface font-bold text-fg shadow-[0_1px_2px_rgb(0_0_0/0.08)]'
                : 'text-fg-muted hover:text-fg',
            )}
          >
            {item.label}
            {item.count === undefined ? null : (
              <span
                className={cn(
                  'h-5 min-w-5 rounded-full px-1.5 text-note leading-5 tabular-nums',
                  item.isEmphasized && item.count > 0 ? 'bg-role font-bold text-role-on' : 'bg-border text-fg-muted',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
