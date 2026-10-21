import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import { DAY_LABELS, DAY_ORDER } from '../lib/format-business-hour';
import type { BusinessHour } from '../model/store-types';

/** CMP-18 WeekHours(표시) — 월~일 7칸 그리드, 오늘 강조. */
export interface StoreHoursCardProps {
  hours: BusinessHour[];
  /** 오늘 요일 (0=일 ~ 6=토) */
  today: number;
  className?: string;
}

/**
 * 요일별 영업시간을 7칸 그리드로 렌더링한다.
 * @param props hours(7행 영업시간), today(강조할 요일)
 * @returns 영업시간 그리드 요소
 */
export function StoreHoursCard({ hours, today, className }: StoreHoursCardProps): ReactNode {
  return (
    <ol className={cn('grid grid-cols-7 gap-1 text-center', className)}>
      {DAY_ORDER.map((day) => {
        const hour = hours.find((item) => item.dayOfWeek === day);
        const isToday = day === today;
        return (
          <li
            key={day}
            aria-current={isToday ? 'date' : undefined}
            className={cn(
              'flex flex-col gap-0.5 rounded-lg border px-1 py-1.5 text-note',
              isToday ? 'border-role bg-role/10 font-semibold text-role' : 'border-border text-fg-muted',
            )}
          >
            <span>{DAY_LABELS[day]}</span>
            <span className='tabular-nums'>
              {!hour || hour.isClosed ? '휴무' : hour.openTime}
              {hour && !hour.isClosed ? (
                <>
                  <br />~{hour.closeTime}
                </>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
