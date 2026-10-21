import type { Delivery } from './delivery-types';

/** 화면 확인용 배달 목록 (API 연동 전 임시). 결제대기·결제완료·조리중 주문은 배달 없음(404) */
export const DELIVERY_LIST_MOCK: Delivery[] = [
  {
    id: 302,
    orderId: 1002,
    status: 'PICKED_UP',
    riderName: '김라이더',
    assignedAt: '2026-10-13T12:05:00+09:00',
    pickedUpAt: '2026-10-13T12:12:00+09:00',
    completedAt: null,
  },
  {
    id: 301,
    orderId: 1001,
    status: 'DELIVERED',
    riderName: '김라이더',
    assignedAt: '2026-10-12T18:35:00+09:00',
    pickedUpAt: '2026-10-12T18:42:00+09:00',
    completedAt: '2026-10-12T18:58:00+09:00',
  },
];

/**
 * 주문 ID로 목 배달을 찾는다.
 * @param orderId 주문 ID
 * @returns 배달 (없으면 null — API 404에 대응)
 */
export const getDeliveryMockByOrder = (orderId: number): Delivery | null =>
  DELIVERY_LIST_MOCK.find((delivery) => delivery.orderId === orderId) ?? null;
