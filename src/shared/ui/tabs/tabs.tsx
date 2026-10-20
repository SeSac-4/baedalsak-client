import { cn } from '@/shared/lib/cn';

/** 탭 네비게이션 (O-01 신규/진행 중/완료). count>0이면 탭 배지 표시. 제어형. */
export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div
      role='tablist'
      className={cn('flex gap-1 border-b border-border', className)}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type='button'
            role='tab'
            aria-selected={active}
            aria-current={active ? 'page' : undefined}
            onClick={() => onChange(item.value)}
            className={cn(
              '-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-body font-medium transition',
              'focus-visible:ring-2 focus-visible:ring-role/50 focus-visible:outline-none',
              active ? 'border-role text-role' : 'border-transparent text-fg-muted hover:text-fg',
            )}
          >
            {item.label}
            {typeof item.count === 'number' && item.count > 0 ? (
              <span className='rounded-full bg-role/10 px-1.5 text-note text-role tabular-nums'>{item.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
