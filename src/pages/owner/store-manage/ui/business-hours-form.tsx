import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { DAY_LABELS, DAY_ORDER, type BusinessHour } from '@/entities/store';
import { getErrorMessage, getFieldErrors } from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Notice } from '@/shared/ui/notice';
import { useToast } from '@/shared/ui/toast';

import { businessHoursSchema, type BusinessHoursFormValues } from '../model/business-hours-schema';
import { useUpdateBusinessHours } from '../model/use-update-business-hours';

export interface BusinessHoursFormProps {
  storeId: number;
  /** 서버가 준 요일별 영업시간 */
  hours: BusinessHour[];
  /** 오늘 요일 (0=일 ~ 6=토) */
  today: number;
}

const DEFAULT_OPEN_TIME = '09:00';
const DEFAULT_CLOSE_TIME = '22:00';
const DAYS_OF_WEEK: number[] = [0, 1, 2, 3, 4, 5, 6];
const SAVED_MESSAGE = '영업시간을 저장했어요.';
const ERROR_CLASS = 'text-note text-warn';
const HEAD_CLASS = 'text-note text-fg-muted';
/** 휴무 요일 시각 칸: 값은 폼에 남기되(검증·저장용) 입력을 막은 것처럼 보이게 한다 */
const CLOSED_INPUT_CLASS = 'pointer-events-none bg-track text-fg-disabled read-only:bg-track';

/**
 * 서버 영업시간을 폼 값으로 바꾼다. 휴무라 시각이 없으면 기본 시각을 채워 둔다.
 * @param hours - 서버 영업시간
 * @returns 폼 값 (index = dayOfWeek)
 */
const parseFormValues = (hours: BusinessHour[]): BusinessHoursFormValues => ({
  businessHours: DAYS_OF_WEEK.map((dayOfWeek) => {
    const hour = hours.find((item) => item.dayOfWeek === dayOfWeek);
    return {
      dayOfWeek,
      openTime: hour?.openTime ?? DEFAULT_OPEN_TIME,
      closeTime: hour?.closeTime ?? DEFAULT_CLOSE_TIME,
      isClosed: hour?.isClosed ?? false,
    };
  }),
});

/**
 * 폼 값을 요청 본문으로 바꾼다. 휴무면 시각을 null로 보낸다.
 * @param values - 폼 값
 * @returns 요청할 영업시간 7행
 */
const parseRequest = (values: BusinessHoursFormValues): BusinessHour[] =>
  values.businessHours.map((hour) => ({
    dayOfWeek: hour.dayOfWeek,
    openTime: hour.isClosed ? null : hour.openTime,
    closeTime: hour.isClosed ? null : hour.closeTime,
    isClosed: hour.isClosed,
  }));

/**
 * 영업시간 카드 (O-04) — 요일·오픈·마감·휴무 4열, 7행을 한 번에 저장한다. 휴무면 요일을 흐리게 하고 시각 입력을 막는다.
 * @param props storeId(가게 ID), hours(요일별 영업시간), today(오늘 표시할 요일)
 * @returns 영업시간 편집 폼 요소
 */
export function BusinessHoursForm({ storeId, hours, today }: BusinessHoursFormProps): ReactNode {
  const toast = useToast();
  const { mutateAsync: updateBusinessHours } = useUpdateBusinessHours(storeId);
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BusinessHoursFormValues>({
    resolver: zodResolver(businessHoursSchema),
    defaultValues: parseFormValues(hours),
  });
  const watchedHours = useWatch({ control, name: 'businessHours' });

  /**
   * 영업시간을 저장한다. 서버 필드 검증 실패는 카드 안 안내 상자에, 그 밖의 에러는 토스트로 알린다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: BusinessHoursFormValues): Promise<void> => {
    try {
      await updateBusinessHours(parseRequest(values));
      toast(SAVED_MESSAGE, 'success');
    } catch (error: unknown) {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors.length > 0) {
        setError('root', { message: fieldErrors.map((item) => item.reason).join(' ') });
        return;
      }
      toast(getErrorMessage(error));
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <Card className='flex flex-col gap-4'>
        <div className='flex flex-col gap-0.5'>
          <h2 className='font-bold text-fg'>영업시간</h2>
          <p className='text-note text-fg-muted'>
            정상 운영이면서 영업시간 안일 때만 주문을 받아요. 7일을 한 번에 저장해요.
          </p>
        </div>
        <div className='grid grid-cols-[52px_1fr_1fr_44px] items-center gap-x-2 gap-y-2 tablet:grid-cols-[72px_1fr_1fr_56px]'>
          <span className={HEAD_CLASS}>요일</span>
          <span className={HEAD_CLASS}>오픈</span>
          <span className={HEAD_CLASS}>마감</span>
          <span className={cn(HEAD_CLASS, 'text-center')}>휴무</span>
          {DAY_ORDER.map((day) => {
            const isClosed = watchedHours[day]?.isClosed ?? false;
            const rowError = errors.businessHours?.[day];
            return (
              <div
                key={day}
                className='contents'
              >
                <div
                  aria-hidden
                  className='col-span-4 border-t border-border'
                />
                <span className={cn('flex items-baseline gap-1 font-bold', isClosed ? 'text-fg-disabled' : 'text-fg')}>
                  {DAY_LABELS[day]}
                  {day === today ? <small className='text-note font-normal text-role-ink'>오늘</small> : null}
                </span>
                <Input
                  type='time'
                  aria-label={`${DAY_LABELS[day]}요일 오픈`}
                  aria-invalid={Boolean(rowError?.openTime)}
                  aria-disabled={isClosed}
                  readOnly={isClosed}
                  tabIndex={isClosed ? -1 : undefined}
                  className={cn('tabular-nums', isClosed && CLOSED_INPUT_CLASS)}
                  {...register(`businessHours.${day}.openTime`)}
                />
                <Input
                  type='time'
                  aria-label={`${DAY_LABELS[day]}요일 마감`}
                  aria-invalid={Boolean(rowError?.closeTime)}
                  aria-disabled={isClosed}
                  readOnly={isClosed}
                  tabIndex={isClosed ? -1 : undefined}
                  className={cn('tabular-nums', isClosed && CLOSED_INPUT_CLASS)}
                  {...register(`businessHours.${day}.closeTime`)}
                />
                <input
                  type='checkbox'
                  aria-label={`${DAY_LABELS[day]}요일 휴무`}
                  className='size-[18px] justify-self-center accent-role-ink'
                  {...register(`businessHours.${day}.isClosed`)}
                />
                {rowError?.openTime || rowError?.closeTime ? (
                  <span className={cn(ERROR_CLASS, 'col-span-4')}>
                    {rowError.openTime?.message ?? rowError.closeTime?.message}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
        {errors.root ? (
          <Notice
            tone='warn'
            role='alert'
          >
            {errors.root.message}
          </Notice>
        ) : null}
        <Button
          type='submit'
          size='lg'
          block
          disabled={isSubmitting}
        >
          영업시간 저장
        </Button>
      </Card>
    </form>
  );
}
