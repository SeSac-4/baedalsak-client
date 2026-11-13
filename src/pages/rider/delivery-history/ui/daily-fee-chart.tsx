import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';

import { formatDateKey } from '../lib/history-period';

/** 막대 하나 */
export interface DailyFeeBar {
  dateKey: string;
  /** 막대 아래 이름 (빈 문자열이면 숨김) */
  label: string;
  totalFee: number;
}

export interface DailyFeeChartProps {
  bars: DailyFeeBar[];
  /** 고른 날짜 (없으면 null) */
  selectedDateKey: string | null;
  onSelect: (dateKey: string | null) => void;
}

/**
 * 일별 배달비 막대 차트. 막대를 누르면 그날을 고르고, 다시 누르면 고르기를 푼다.
 * 고른 날이 없으면 가장 많이 번 날을 역할색으로 강조한다.
 * @param props bars(막대 목록), selectedDateKey(고른 날짜), onSelect
 * @returns 차트 요소
 */
export function DailyFeeChart({ bars, selectedDateKey, onSelect }: DailyFeeChartProps): ReactNode {
  const maxFee = Math.max(0, ...bars.map((bar) => bar.totalFee));

  /**
   * 막대가 강조 대상인지 확인한다.
   * @param bar 막대
   * @returns 강조 여부
   */
  const isHighlighted = (bar: DailyFeeBar): boolean =>
    selectedDateKey ? bar.dateKey === selectedDateKey : maxFee > 0 && bar.totalFee === maxFee;

  return (
    <div className='flex h-44 items-stretch gap-1'>
      {bars.map((bar) => (
        <button
          key={bar.dateKey}
          type='button'
          aria-pressed={bar.dateKey === selectedDateKey}
          aria-label={`${formatDateKey(bar.dateKey)} ${formatPrice(bar.totalFee)}`}
          onClick={() => onSelect(bar.dateKey === selectedDateKey ? null : bar.dateKey)}
          className='group flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink'
        >
          <span className='flex w-full flex-1 items-end justify-center'>
            <span
              className={cn(
                'w-full max-w-6 rounded-t-[4px] transition-colors',
                isHighlighted(bar) ? 'bg-role' : 'bg-role-soft group-hover:bg-role-light',
              )}
              style={{
                height: maxFee === 0 ? 0 : `${(bar.totalFee / maxFee) * 100}%`,
                minHeight: bar.totalFee > 0 ? 2 : 0,
              }}
            />
          </span>
          <span className='h-4 text-[11px] leading-4 text-fg-muted tabular-nums'>{bar.label}</span>
        </button>
      ))}
    </div>
  );
}
