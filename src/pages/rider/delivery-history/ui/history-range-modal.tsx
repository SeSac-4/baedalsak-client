import { useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { IconButton } from '@/shared/ui/icon-button';
import { Modal } from '@/shared/ui/modal';

import {
  addMonths,
  diffDays,
  formatShortDateKey,
  getMonthGrid,
  MAX_CUSTOM_DAYS,
  type HistoryRange,
} from '../lib/history-period';

const WEEKDAY_HEADER = ['일', '월', '화', '수', '목', '금', '토'];

export interface HistoryRangeModalProps {
  open: boolean;
  /** 오늘 날짜 키 (이후 날짜는 고를 수 없다) */
  today: string;
  /** 처음 보여 줄 기간 (없으면 아무것도 고르지 않은 상태) */
  initialRange: HistoryRange | null;
  onApply: (range: HistoryRange) => void;
  onClose: () => void;
}

interface RangeCalendarProps {
  today: string;
  initialRange: HistoryRange | null;
  onApply: (range: HistoryRange) => void;
  onClose: () => void;
}

/**
 * 달력 본문. 시작일과 끝나는 날을 차례로 누르고 적용한다. 모달이 열릴 때마다 새로 만들어져 상태가 초기화된다.
 * @param props today, initialRange, onApply, onClose
 * @returns 달력 요소
 */
function RangeCalendar({ today, initialRange, onApply, onClose }: RangeCalendarProps): ReactNode {
  const [start, setStart] = useState<string | null>(initialRange?.from ?? null);
  const [end, setEnd] = useState<string | null>(initialRange?.to ?? null);
  const [monthKey, setMonthKey] = useState((initialRange?.to ?? today).slice(0, 7));
  const thisMonth = today.slice(0, 7);
  const isPickingEnd = start !== null && end === null;

  /**
   * 고를 수 없는 날인지 확인한다. 오늘 이후, 끝나는 날을 고를 때는 최대 일 수를 넘는 날이 막힌다.
   * @param dateKey 날짜 키
   * @returns 막힘 여부
   */
  const isDisabled = (dateKey: string): boolean =>
    dateKey > today || (isPickingEnd && Math.abs(diffDays(start, dateKey)) >= MAX_CUSTOM_DAYS);

  /**
   * 날짜를 누른다. 시작일이 없거나 기간이 이미 정해졌으면 새 시작일, 아니면 끝나는 날로 둔다(앞 날짜면 서로 바꾼다).
   * @param dateKey 누른 날짜 키
   */
  const handleSelect = (dateKey: string): void => {
    if (!isPickingEnd) {
      setStart(dateKey);
      setEnd(null);
      return;
    }
    if (dateKey < start) {
      setStart(dateKey);
      setEnd(start);
      return;
    }
    setEnd(dateKey);
  };

  const summary =
    start && end
      ? `${formatShortDateKey(start)} ~ ${formatShortDateKey(end)} · ${diffDays(start, end) + 1}일`
      : start
        ? `${formatShortDateKey(start)} ~ 끝나는 날을 골라요`
        : `시작일과 끝나는 날을 차례로 눌러요 (최대 ${MAX_CUSTOM_DAYS}일)`;

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center justify-between'>
        <IconButton
          icon='chevron-left'
          label='이전 달'
          variant='ghost'
          onClick={() => setMonthKey(addMonths(monthKey, -1))}
        />
        <p className='font-bold text-fg tabular-nums'>
          {monthKey.slice(0, 4)}년 {Number(monthKey.slice(5, 7))}월
        </p>
        <IconButton
          icon='chevron-right'
          label='다음 달'
          variant='ghost'
          disabled={monthKey >= thisMonth}
          onClick={() => setMonthKey(addMonths(monthKey, 1))}
        />
      </div>

      <div className='grid grid-cols-7 text-center text-note text-fg-muted'>
        {WEEKDAY_HEADER.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className='grid grid-cols-7 gap-y-0.5'>
        {getMonthGrid(monthKey).map((dateKey, index) => {
          if (!dateKey) return <span key={`blank-${index}`} />;
          const isEdge = dateKey === start || dateKey === end;
          const isInRange = start !== null && end !== null && dateKey > start && dateKey < end;
          return (
            <button
              key={dateKey}
              type='button'
              disabled={isDisabled(dateKey)}
              aria-pressed={isEdge || isInRange}
              aria-label={formatShortDateKey(dateKey)}
              onClick={() => handleSelect(dateKey)}
              className={cn(
                'flex h-10 items-center justify-center text-body tabular-nums transition-colors',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink',
                'disabled:cursor-not-allowed disabled:text-fg-disabled',
                isEdge
                  ? 'rounded-full bg-role font-bold text-role-on'
                  : isInRange
                    ? 'bg-role-soft text-role-ink'
                    : 'rounded-full text-fg enabled:hover:bg-surface-hover',
              )}
            >
              {Number(dateKey.slice(8))}
            </button>
          );
        })}
      </div>

      <p
        aria-live='polite'
        className='text-note text-fg-muted tabular-nums'
      >
        {summary}
      </p>

      <div className='flex gap-2 *:flex-1'>
        <Button
          variant='secondary'
          onClick={onClose}
        >
          취소
        </Button>
        <Button
          disabled={!start}
          onClick={() => {
            if (start) onApply({ from: start, to: end ?? start });
          }}
        >
          적용
        </Button>
      </div>
    </div>
  );
}

/**
 * 배달 내역 기간 선택 모달. 화면 위에 떠서 아래 내용을 가린다. 오늘 이후는 고를 수 없고 최대 31일까지 고른다.
 * 시작일만 고르고 적용하면 그 하루만 본다.
 * @param props open, today, initialRange, onApply, onClose
 * @returns 모달 요소
 */
export function HistoryRangeModal({ open, today, initialRange, onApply, onClose }: HistoryRangeModalProps): ReactNode {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title='기간 선택'
    >
      <RangeCalendar
        today={today}
        initialRange={initialRange}
        onApply={onApply}
        onClose={onClose}
      />
    </Modal>
  );
}
