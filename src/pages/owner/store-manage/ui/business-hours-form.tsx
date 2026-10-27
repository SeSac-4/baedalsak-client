import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { DAY_LABELS, DAY_ORDER, type BusinessHour } from '@/entities/store';
import { getErrorMessage, getFieldErrors } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
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
 * CMP-18 WeekHours(편집) — 요일·오픈·마감·휴무 4열, 7행을 한 번에 저장한다. 휴무면 시각 입력을 막는다.
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
   * 영업시간을 저장한다. 서버 필드 검증 실패는 폼 아래에, 그 밖의 에러는 토스트로 알린다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: BusinessHoursFormValues): Promise<void> => {
    try {
      await updateBusinessHours(parseRequest(values));
      toast(SAVED_MESSAGE);
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
      className='flex flex-col gap-4'
    >
      <div className='grid grid-cols-[50px_1fr_1fr_44px] items-center gap-2 tablet:grid-cols-[80px_1fr_1fr_60px]'>
        <span className='text-note text-fg-muted'>요일</span>
        <span className='text-note text-fg-muted'>오픈</span>
        <span className='text-note text-fg-muted'>마감</span>
        <span className='text-center text-note text-fg-muted'>휴무</span>
        {DAY_ORDER.map((day) => {
          const isClosed = watchedHours[day]?.isClosed ?? false;
          const rowError = errors.businessHours?.[day];
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
                aria-invalid={Boolean(rowError?.openTime)}
                readOnly={isClosed}
                tabIndex={isClosed ? -1 : undefined}
                className={isClosed ? 'opacity-40' : undefined}
                {...register(`businessHours.${day}.openTime`)}
              />
              <Input
                type='time'
                aria-label={`${DAY_LABELS[day]}요일 마감`}
                aria-invalid={Boolean(rowError?.closeTime)}
                readOnly={isClosed}
                tabIndex={isClosed ? -1 : undefined}
                className={isClosed ? 'opacity-40' : undefined}
                {...register(`businessHours.${day}.closeTime`)}
              />
              <input
                type='checkbox'
                aria-label={`${DAY_LABELS[day]}요일 휴무`}
                className='size-[18px] justify-self-center accent-role'
                {...register(`businessHours.${day}.isClosed`)}
              />
              {rowError?.openTime || rowError?.closeTime ? (
                <span className={`${ERROR_CLASS} col-span-4`}>
                  {rowError.openTime?.message ?? rowError.closeTime?.message}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      {errors.root ? <p className={ERROR_CLASS}>{errors.root.message}</p> : null}
      <div>
        <Button
          type='submit'
          disabled={isSubmitting}
        >
          영업시간 저장
        </Button>
      </div>
    </form>
  );
}
