import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { formatDistance, useDeliveryHistory, type RiderDeliveryHistory } from '@/entities/delivery';
import { getErrorMessage } from '@/shared/api';
import { formatPrice, formatTime } from '@/shared/lib/format';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { Icon } from '@/shared/ui/icon';
import { IconButton } from '@/shared/ui/icon-button';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';
import { Tabs, type TabItem } from '@/shared/ui/tabs';

import {
  diffDays,
  formatDateKey,
  formatShortDateKey,
  getDateKeyList,
  getHistoryRange,
  getKstDateKey,
  getWeekdayLabel,
  type HistoryPeriod,
  type HistoryRange,
} from '../lib/history-period';
import { getHistoryDayList, getHistorySummary } from '../lib/history-summary';
import { DailyFeeChart, type DailyFeeBar } from './daily-fee-chart';
import { HistoryRangeModal } from './history-range-modal';

const PAGE_CLASS =
  'mx-auto flex w-full flex-col gap-3 px-4 pt-4 pb-6 tablet:max-w-[760px] tablet:gap-3.5 tablet:px-6 tablet:pt-5 tablet:pb-10 desktop:max-w-[1180px] desktop:gap-4 desktop:px-10 desktop:pt-7 desktop:pb-12';
const MONTH_LABEL_STEP = 5;
const WEEKDAY_LABEL_MAX_DAYS = 7;

const PERIOD_TABS: TabItem[] = [
  { value: 'today', label: '오늘' },
  { value: 'week', label: '이번 주' },
  { value: 'month', label: '이번 달' },
  { value: 'custom', label: '기간 선택' },
];

const PERIOD_EMPTY_MESSAGE: Record<HistoryPeriod, string> = {
  today: '오늘 완료한 배달이 없어요.',
  week: '이번 주 완료한 배달이 없어요.',
  month: '이번 달 완료한 배달이 없어요.',
  custom: '고른 기간에 완료한 배달이 없어요.',
};

/**
 * 탭 값이 조회 기간인지 확인한다.
 * @param value 탭 값
 * @returns 조회 기간 여부
 */
const isHistoryPeriod = (value: string): value is HistoryPeriod =>
  value === 'today' || value === 'week' || value === 'month' || value === 'custom';

/**
 * 차트 막대를 만든다. 7일 이하는 요일, 그보다 길면 1일과 5일 단위만 이름을 붙인다.
 * @param range 기간 범위
 * @param feeByDate 날짜별 배달비 합계
 * @returns 막대 목록
 */
const getDailyFeeBars = (range: HistoryRange, feeByDate: Map<string, number>): DailyFeeBar[] => {
  const isShort = diffDays(range.from, range.to) < WEEKDAY_LABEL_MAX_DAYS;
  return getDateKeyList(range).map((dateKey) => {
    const day = Number(dateKey.slice(8));
    const label = isShort ? getWeekdayLabel(dateKey) : day === 1 || day % MONTH_LABEL_STEP === 0 ? String(day) : '';
    return { dateKey, label, totalFee: feeByDate.get(dateKey) ?? 0 };
  });
};

/**
 * 배달 한 건 줄을 렌더링한다.
 * @param delivery 완료한 배달
 * @returns 목록 항목 요소
 */
const renderDeliveryRow = (delivery: RiderDeliveryHistory): ReactNode => (
  <li
    key={delivery.deliveryId}
    className='grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 border-t border-border py-3'
  >
    <span className='text-note text-fg-muted tabular-nums'>{formatTime(delivery.completedAt)}</span>
    <div className='min-w-0 leading-[1.45]'>
      <p className='flex min-w-0 items-center gap-1 font-bold text-fg'>
        <span className='truncate'>{delivery.storeName}</span>
        <Icon
          name='chevron-right'
          size={14}
          className='flex-none text-fg-muted'
        />
        <span className='truncate'>{delivery.deliveryAddress}</span>
      </p>
      <p className='text-note text-fg-muted tabular-nums'>
        주문 #{delivery.orderId}
        {delivery.distanceM === null ? '' : ` · ${formatDistance(delivery.distanceM)}`}
      </p>
    </div>
    <span className='font-bold whitespace-nowrap text-fg tabular-nums'>+{formatPrice(delivery.deliveryFee)}</span>
  </li>
);

/**
 * 라이더 배달 내역 화면. 오늘·이번 주·이번 달·달력에서 고른 기간 동안 완료한 배달의 배달비 합계·건수·평균을 보여 주고,
 * 이틀 이상이면 일별 배달비 차트를 함께 보여 준다. 막대를 누르면 아래 목록이 그날 배달만 보여 준다.
 * @returns 배달 내역 페이지
 */
export function DeliveryHistoryPage(): ReactNode {
  const [period, setPeriod] = useState<HistoryPeriod>('week');
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [customRange, setCustomRange] = useState<HistoryRange | null>(null);
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const today = getKstDateKey(new Date());
  const range = useMemo(
    () =>
      period === 'custom' && customRange ? customRange : getHistoryRange(period === 'custom' ? 'week' : period, today),
    [period, customRange, today],
  );
  const { data: deliveries, error, isPending, isFetching, refetch } = useDeliveryHistory(range.from, range.to);

  const dayList = useMemo(() => getHistoryDayList(deliveries ?? []), [deliveries]);
  const summary = useMemo(() => getHistorySummary(deliveries ?? []), [deliveries]);
  const bars = useMemo(
    () => getDailyFeeBars(range, new Map(dayList.map((day) => [day.dateKey, day.totalFee]))),
    [range, dayList],
  );
  const visibleDays = selectedDateKey ? dayList.filter((day) => day.dateKey === selectedDateKey) : dayList;

  /**
   * 조회 기간을 바꾸고 고른 날짜를 푼다. 기간 선택은 달력을 열고, 적용해야 바뀐다.
   * @param value 탭 값
   */
  const handlePeriodChange = (value: string): void => {
    if (!isHistoryPeriod(value)) return;
    if (value === 'custom') {
      setIsRangeOpen(true);
      return;
    }
    setPeriod(value);
    setSelectedDateKey(null);
  };

  /**
   * 달력에서 고른 기간을 적용한다.
   * @param nextRange 고른 기간
   */
  const handleRangeApply = (nextRange: HistoryRange): void => {
    setCustomRange(nextRange);
    setPeriod('custom');
    setSelectedDateKey(null);
    setIsRangeOpen(false);
  };

  // 모달은 onClose가 바뀌면 포커스를 다시 잡으므로 고정한다
  const handleRangeClose = useCallback(() => setIsRangeOpen(false), []);

  const summaryItems = [
    { label: '건수', value: `${summary.count}건` },
    { label: '건당 평균', value: formatPrice(summary.averageFee) },
    { label: '평균 배달 시간', value: `${summary.averageMinutes}분` },
  ];

  return (
    <div className={PAGE_CLASS}>
      <PageHeader
        title='배달 내역'
        actions={
          <IconButton
            icon='refresh'
            label='새로고침'
            disabled={isFetching}
            onClick={() => void refetch()}
          />
        }
      />

      <Tabs
        label='조회 기간'
        items={PERIOD_TABS}
        value={period}
        onChange={handlePeriodChange}
        className='tablet:max-w-[520px]'
      />

      {period === 'custom' && customRange ? (
        <button
          type='button'
          onClick={() => setIsRangeOpen(true)}
          className='inline-flex min-h-9 items-center gap-1 self-start rounded-full border border-role bg-role-soft px-3 text-note font-semibold text-role-ink tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink'
        >
          {customRange.from === customRange.to
            ? formatShortDateKey(customRange.from)
            : `${formatShortDateKey(customRange.from)} ~ ${formatShortDateKey(customRange.to)}`}
          <Icon
            name='chevron-down'
            size={14}
          />
        </button>
      ) : null}

      <HistoryRangeModal
        open={isRangeOpen}
        today={today}
        initialRange={customRange}
        onApply={handleRangeApply}
        onClose={handleRangeClose}
      />

      {isPending ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='배달 내역 불러오는 중' />
          배달 내역을 불러오고 있어요.
        </div>
      ) : null}

      {error ? <EmptyState message={getErrorMessage(error)} /> : null}

      {deliveries ? (
        <>
          <div className='grid grid-cols-2 gap-2.5 desktop:grid-cols-4'>
            <Card className='col-span-2 desktop:col-span-1'>
              <p className='text-note text-fg-muted'>총 배달비</p>
              <p className='mt-1 text-title font-bold text-role-ink tabular-nums'>{formatPrice(summary.totalFee)}</p>
            </Card>
            {summaryItems.map((item) => (
              <Card key={item.label}>
                <p className='text-note text-fg-muted'>{item.label}</p>
                <p className='mt-1 text-title font-bold text-fg tabular-nums'>{item.value}</p>
              </Card>
            ))}
          </div>

          {range.from === range.to ? null : (
            <Card>
              <div className='mb-3 flex items-baseline justify-between gap-2'>
                <h2 className='font-bold text-fg'>일별 배달비</h2>
                <span className='text-note text-fg-muted'>막대를 누르면 그날 내역만 보여요</span>
              </div>
              <DailyFeeChart
                bars={bars}
                selectedDateKey={selectedDateKey}
                onSelect={setSelectedDateKey}
              />
            </Card>
          )}

          {dayList.length === 0 ? <EmptyState message={PERIOD_EMPTY_MESSAGE[period]} /> : null}
          {selectedDateKey && visibleDays.length === 0 ? (
            <EmptyState message={`${formatDateKey(selectedDateKey)}에는 완료한 배달이 없어요.`} />
          ) : null}

          {visibleDays.map((day) => (
            <section
              key={day.dateKey}
              className='flex flex-col'
            >
              <div className='flex items-baseline justify-between gap-2 pb-1'>
                <h2 className='font-bold text-fg'>{formatDateKey(day.dateKey)}</h2>
                <span className='text-note text-fg-muted tabular-nums'>
                  {day.deliveries.length}건 ·{' '}
                  <span className='font-bold text-role-ink'>{formatPrice(day.totalFee)}</span>
                </span>
              </div>
              <ul>{day.deliveries.map(renderDeliveryRow)}</ul>
            </section>
          ))}
        </>
      ) : null}
    </div>
  );
}
