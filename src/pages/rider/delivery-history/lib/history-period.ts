/** 조회 기간 */
export type HistoryPeriod = 'today' | 'week' | 'month';

/** 기간 범위 (YYYY-MM-DD, 둘 다 포함) */
export interface HistoryRange {
  from: string;
  to: string;
}

const DAY_MS = 86_400_000;
const WEEKDAY_LABEL = ['일', '월', '화', '수', '목', '금', '토'];

const KST_DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * 날짜 키(YYYY-MM-DD)를 UTC 자정 Date로 바꾼다. 요일·날짜 계산에만 쓴다.
 * @param dateKey - YYYY-MM-DD
 * @returns UTC 자정 Date
 */
const parseDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

/**
 * 시각을 한국 날짜 키로 바꾼다. 자정 근처 배달도 한국 날짜로 묶인다.
 * @param value - ISO 8601 시각 또는 Date
 * @returns YYYY-MM-DD
 */
export const getKstDateKey = (value: string | Date): string =>
  KST_DATE_FORMATTER.format(typeof value === 'string' ? new Date(value) : value);

/**
 * 날짜 키에 일 수를 더한다.
 * @param dateKey - YYYY-MM-DD
 * @param days - 더할 일 수 (음수면 뺀다)
 * @returns YYYY-MM-DD
 */
export const addDays = (dateKey: string, days: number): string => {
  const date = parseDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

/**
 * 오늘(한국 날짜) 기준 기간 범위를 구한다. 이번 주는 월~일, 이번 달은 1일~말일.
 * @param period - 조회 기간
 * @param today - 오늘 날짜 키 (YYYY-MM-DD)
 * @returns 기간 범위
 */
export const getHistoryRange = (period: HistoryPeriod, today: string): HistoryRange => {
  if (period === 'today') return { from: today, to: today };
  if (period === 'week') {
    const monday = addDays(today, -((parseDateKey(today).getUTCDay() + 6) % 7));
    return { from: monday, to: addDays(monday, 6) };
  }
  const date = parseDateKey(today);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
  return { from: `${today.slice(0, 8)}01`, to: lastDay.toISOString().slice(0, 10) };
};

/**
 * 기간 안의 날짜 키를 순서대로 나열한다.
 * @param range - 기간 범위
 * @returns 날짜 키 목록
 */
export const getDateKeyList = (range: HistoryRange): string[] => {
  const dayCount = (parseDateKey(range.to).getTime() - parseDateKey(range.from).getTime()) / DAY_MS + 1;
  return Array.from({ length: dayCount }, (_, index) => addDays(range.from, index));
};

/**
 * 날짜 키의 요일 이름을 구한다.
 * @param dateKey - YYYY-MM-DD
 * @returns 예: 금
 */
export const getWeekdayLabel = (dateKey: string): string => WEEKDAY_LABEL[parseDateKey(dateKey).getUTCDay()];

/**
 * 날짜 키를 'M월 D일 (요일)'로 표시한다.
 * @param dateKey - YYYY-MM-DD
 * @returns 예: 11월 13일 (금)
 */
export const formatDateKey = (dateKey: string): string => {
  const date = parseDateKey(dateKey);
  return `${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일 (${getWeekdayLabel(dateKey)})`;
};
