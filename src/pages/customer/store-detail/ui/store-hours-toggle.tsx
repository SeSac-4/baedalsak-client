import { useId, useState, type ReactNode } from 'react';

import { DAY_LABELS, type StoreDetail } from '@/entities/store';
import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

export interface StoreHoursToggleProps {
  store: StoreDetail;
}

const DAYS_IN_WEEK = 7;

/**
 * 영업 상태 줄의 설명을 고른다.
 * @param store - 가게 상세
 * @returns 예: 21:00에 영업 종료, 오늘 휴무, 임시 중지
 */
const getStatusDescription = (store: StoreDetail): string => {
  const { todayHour } = store;
  if (store.operationStatus === 'PAUSED') return '가게 사정으로 임시 중지 중이에요';
  if (todayHour.isClosed || !todayHour.closeTime) return '오늘은 쉬어요';
  return store.isOpenNow ? `${todayHour.closeTime}에 영업 종료` : `오늘 ${todayHour.openTime}~${todayHour.closeTime}`;
};

/**
 * 영업 상태 줄. 누르면 오늘부터 일주일 영업시간을 펼친다.
 * @param props store(가게 상세)
 * @returns 영업시간 접기·펼치기 요소
 */
export function StoreHoursToggle({ store }: StoreHoursToggleProps): ReactNode {
  const listId = useId();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const today = store.todayHour.dayOfWeek;
  const days = Array.from({ length: DAYS_IN_WEEK }, (_, offset) => (today + offset) % DAYS_IN_WEEK);

  return (
    <div className='border-t border-border pt-1'>
      <button
        type='button'
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-label={isOpen ? '요일별 영업시간 접기' : '요일별 영업시간 펼치기'}
        onClick={() => setIsOpen((prev) => !prev)}
        className='flex min-h-11 w-full items-center gap-2 text-left text-fg'
      >
        <Icon
          name='clock'
          size={18}
          className='flex-none text-fg-muted'
        />
        <span className={cn('flex-none font-bold', store.isOpenNow ? 'text-ok' : 'text-fg-muted')}>
          {store.isOpenNow ? '영업 중' : '영업 종료'}
        </span>
        <span className='text-fg-muted'>·</span>
        <span className='min-w-0 flex-1'>{getStatusDescription(store)}</span>
        <Icon
          name='chevron-down'
          size={18}
          className={cn('flex-none text-fg-muted transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen ? (
        <ul
          id={listId}
          className='mb-2 ml-6.5 flex flex-col gap-3'
        >
          {days.map((day) => {
            const hour = store.businessHours.find((item) => item.dayOfWeek === day);
            const isToday = day === today;
            const isClosed = !hour || hour.isClosed;
            return (
              <li
                key={day}
                className={cn('grid grid-cols-[52px_minmax(0,1fr)] gap-x-2', isToday && 'font-bold')}
              >
                <span className='text-fg'>
                  {DAY_LABELS[day]}
                  {isToday ? ' (오늘)' : ''}
                </span>
                <span className={cn('tabular-nums', isClosed ? 'text-warn' : 'text-fg')}>
                  {isClosed ? '정기휴무' : `${hour.openTime} - ${hour.closeTime}`}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
