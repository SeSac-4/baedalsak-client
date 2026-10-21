import type { BusinessHour } from '../model/store-types';

/** 요일 라벨 (dayOfWeek 인덱스: 0=일 ~ 6=토) */
export const DAY_LABELS: string[] = ['일', '월', '화', '수', '목', '금', '토'];

/** 화면 표시 순서: 월 → 일 */
export const DAY_ORDER: number[] = [1, 2, 3, 4, 5, 6, 0];

/**
 * 영업시간 한 행을 표시용 문자열로 바꾼다.
 * @param hour 요일별 영업시간
 * @returns 예: 09:00~22:00, 휴무
 */
export const formatBusinessHour = (hour: BusinessHour): string =>
  hour.isClosed || !hour.openTime || !hour.closeTime ? '휴무' : `${hour.openTime}~${hour.closeTime}`;
