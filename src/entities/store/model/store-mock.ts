import type { BusinessHour, StoreDetail, StoreSummary } from './store-types';

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

/** 화면 확인용 가게 목록 (API 연동 전 임시) */
export const STORE_LIST_MOCK: StoreSummary[] = [
  STORE_DETAIL_MOCK,
  {
    id: 2,
    name: '성수 한상',
    category: 'KOREAN',
    minOrderAmount: 15000,
    deliveryFee: 2500,
    operationStatus: 'OPEN',
    isOpenNow: true,
    todayHour: { dayOfWeek: 2, openTime: '10:30', closeTime: '21:00', isClosed: false },
  },
  {
    id: 3,
    name: '바삭치킨',
    category: 'CHICKEN',
    minOrderAmount: 18000,
    deliveryFee: 3500,
    operationStatus: 'OPEN',
    isOpenNow: false,
    todayHour: { dayOfWeek: 2, openTime: '16:00', closeTime: '24:00', isClosed: false },
  },
  {
    id: 4,
    name: '연무장 커피',
    category: 'CAFE_DESSERT',
    minOrderAmount: 8000,
    deliveryFee: 2000,
    operationStatus: 'PAUSED',
    isOpenNow: false,
    todayHour: { dayOfWeek: 2, openTime: '08:00', closeTime: '20:00', isClosed: false },
  },
];
