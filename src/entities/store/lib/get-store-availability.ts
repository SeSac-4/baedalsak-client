import type { StoreSummary } from '../model/store-types';

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;
/** 마감까지 이 시간(분) 안이면 곧 마감으로 본다 */
const CLOSING_SOON_MINUTES = MINUTES_PER_HOUR;

/** 주문할 수 없는 가게의 안내 문구 */
export interface StoreClosedNotice {
  title: string;
  /** 이유나 다시 여는 시간 (알 수 없으면 없음) */
  description?: string;
}

/** 주문할 수 있는 가게의 마감 안내 */
export interface StoreClosingInfo {
  /** 'HH:mm' */
  closeTime: string;
  isClosingSoon: boolean;
}

/**
 * 'HH:mm' 시각을 하루 기준 분으로 바꾼다.
 * @param time - 'HH:mm' 시각
 * @returns 자정부터 지난 분
 */
const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
};

/**
 * 날짜의 시각을 하루 기준 분으로 바꾼다.
 * @param date - 날짜
 * @returns 자정부터 지난 분
 */
const getMinutesOfDay = (date: Date): number => date.getHours() * MINUTES_PER_HOUR + date.getMinutes();

/**
 * 가게가 지금 주문을 받는지 확인한다.
 * @param store - 가게 요약
 * @returns 영업 중이고 임시 중지가 아니면 true
 */
export const isStoreOrderable = (store: StoreSummary): boolean => store.isOpenNow && store.operationStatus === 'OPEN';

/**
 * 주문할 수 없는 가게의 안내 문구를 구한다. 임시 중지 → 휴무 → 오픈 전 → 마감 후 순서로 판단한다.
 * @param store - 가게 요약
 * @param now - 현재 시각
 * @returns 안내 문구 (주문할 수 있으면 null)
 */
export const getStoreClosedNotice = (store: StoreSummary, now: Date = new Date()): StoreClosedNotice | null => {
  if (isStoreOrderable(store)) return null;
  if (store.operationStatus === 'PAUSED') {
    return { title: '잠시 주문을 쉬고 있어요', description: '가게 사정으로 임시 중지' };
  }

  const { isClosed, openTime, closeTime } = store.todayHour;
  if (isClosed || !openTime || !closeTime) return { title: '오늘은 쉬는 날이에요' };
  if (getMinutesOfDay(now) < parseTimeToMinutes(openTime)) {
    return { title: '지금은 준비 중이에요', description: `${openTime}에 열어요` };
  }
  return { title: '오늘 영업이 끝났어요' };
};

/**
 * 주문할 수 있는 가게의 마감 시각과 곧 마감 여부를 구한다. 자정을 넘겨 영업하는 가게도 계산한다.
 * @param store - 가게 요약
 * @param now - 현재 시각
 * @returns 마감 안내 (주문할 수 없거나 마감 시각이 없으면 null)
 */
export const getStoreClosingInfo = (store: StoreSummary, now: Date = new Date()): StoreClosingInfo | null => {
  const { closeTime } = store.todayHour;
  if (!isStoreOrderable(store) || !closeTime) return null;

  const minutesLeft = (parseTimeToMinutes(closeTime) - getMinutesOfDay(now) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return { closeTime, isClosingSoon: minutesLeft <= CLOSING_SOON_MINUTES };
};
