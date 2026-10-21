import type { FormEvent, ReactNode } from 'react';

import { DAY_LABELS, DAY_ORDER, type BusinessHour } from '@/entities/store';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export interface BusinessHoursFormProps {
  /** 7행 (일~토) */
  defaultValues: BusinessHour[];
  /** 오늘 요일 (0=일 ~ 6=토) */
  today: number;
}

/**
 * 제출 시 새로고침을 막는다. (API 연동 전 임시)
 * @param event 폼 제출 이벤트
 */
const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
  event.preventDefault();
};

/**
 * CMP-18 WeekHours(편집) — 요일·오픈·마감·휴무 4열, 7행을 한 번에 저장한다.
 * @param props defaultValues(요일별 영업시간), today(오늘 표시할 요일)
 * @returns 영업시간 편집 폼 요소
 */
export function BusinessHoursForm({ defaultValues, today }: BusinessHoursFormProps): ReactNode {
  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4'
    >
      <div className='grid grid-cols-[50px_1fr_1fr_44px] items-center gap-2 tablet:grid-cols-[80px_1fr_1fr_60px]'>
        <span className='text-note text-fg-muted'>요일</span>
        <span className='text-note text-fg-muted'>오픈</span>
        <span className='text-note text-fg-muted'>마감</span>
        <span className='text-center text-note text-fg-muted'>휴무</span>
        {DAY_ORDER.map((day) => {
          const hour = defaultValues.find((item) => item.dayOfWeek === day);
          const isClosed = hour?.isClosed ?? false;
          return (
            <div
              key={day}
              className='contents'
            >
              <span className='text-body text-fg'>
                {DAY_LABELS[day]}
                {day === today ? <small className='ml-1 text-note text-fg-subtle'>오늘</small> : null}
              </span>
              <Input
                type='time'
                aria-label={`${DAY_LABELS[day]}요일 오픈`}
                defaultValue={hour?.openTime ?? '09:00'}
                disabled={isClosed}
              />
              <Input
                type='time'
                aria-label={`${DAY_LABELS[day]}요일 마감`}
                defaultValue={hour?.closeTime ?? '22:00'}
                disabled={isClosed}
              />
              <input
                type='checkbox'
                aria-label={`${DAY_LABELS[day]}요일 휴무`}
                defaultChecked={isClosed}
                className='size-[18px] justify-self-center accent-role'
              />
            </div>
          );
        })}
      </div>
      <div>
        <Button type='submit'>영업시간 저장</Button>
      </div>
    </form>
  );
}
