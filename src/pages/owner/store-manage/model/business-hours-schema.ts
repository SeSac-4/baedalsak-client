import { z } from 'zod';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const TIME_MESSAGE = '영업일은 시각을 입력해 주세요.';

/** 하루 영업시간. 휴무가 아니면 오픈·마감 시각('HH:mm') 필수 */
const businessHourSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    openTime: z.string(),
    closeTime: z.string(),
    isClosed: z.boolean(),
  })
  .superRefine((hour, context) => {
    if (hour.isClosed) return;
    if (!TIME_PATTERN.test(hour.openTime))
      context.addIssue({ code: 'custom', message: TIME_MESSAGE, path: ['openTime'] });
    if (!TIME_PATTERN.test(hour.closeTime)) {
      context.addIssue({ code: 'custom', message: TIME_MESSAGE, path: ['closeTime'] });
    }
  });

/** 요일별 영업시간 폼 검증 (일~토 7행) */
export const businessHoursSchema = z.object({
  businessHours: z.array(businessHourSchema).length(7),
});

/** 요일별 영업시간 폼 값 (index = dayOfWeek) */
export type BusinessHoursFormValues = z.infer<typeof businessHoursSchema>;
