import type { BusinessHour, StoreDetail } from './store-types';

/** 화면 확인용 기본 영업시간 (일요일 휴무, 09:00~22:00) */
const BUSINESS_HOURS_MOCK: BusinessHour[] = [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) =>
  dayOfWeek === 0
    ? { dayOfWeek, openTime: null, closeTime: null, isClosed: true }
    : { dayOfWeek, openTime: '09:00', closeTime: '22:00', isClosed: false },
);

/** 화면 확인용 가게 상세 (API 연동 전 임시) */
export const STORE_DETAIL_MOCK: StoreDetail = {
  id: 1,
  name: '싹싹김밥 성수점',
  category: 'SNACK',
  address: '서울 성동구 성수이로 120',
  minOrderAmount: 12000,
  deliveryFee: 3000,
  operationStatus: 'OPEN',
  isOpenNow: true,
  todayHour: BUSINESS_HOURS_MOCK[2],
  businessHours: BUSINESS_HOURS_MOCK,
};
