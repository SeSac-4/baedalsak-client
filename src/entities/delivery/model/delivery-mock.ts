import type { Delivery, RiderDelivery, WaitingDelivery } from './delivery-types';

/** 화면 확인용 배달 목록 (API 연동 전 임시). 결제대기·결제완료·조리중 주문은 배달 없음(404) */
export const DELIVERY_LIST_MOCK: Delivery[] = [
  {
    deliveryId: 302,
    orderId: 1002,
    status: 'PICKED_UP',
    storeName: '김밥싹 성수점',
    riderId: 41,
    riderName: '김라이더',
    assignedAt: '2026-10-13T12:05:00+09:00',
    pickedUpAt: '2026-10-13T12:12:00+09:00',
    completedAt: null,
  },
  {
    deliveryId: 301,
    orderId: 1001,
    status: 'DELIVERED',
    storeName: '김밥싹 성수점',
    riderId: 41,
    riderName: '김라이더',
    assignedAt: '2026-10-12T18:35:00+09:00',
    pickedUpAt: '2026-10-12T18:42:00+09:00',
    completedAt: '2026-10-12T18:58:00+09:00',
  },
];

/** 갤러리 확인용 배차 대기 배달 */
export const WAITING_DELIVERY_MOCK: WaitingDelivery = {
  deliveryId: 303,
  storeName: '김밥싹 성수점',
  pickupAddress: '서울 성동구 성수이로 120',
  deliveryDong: '성수동2가',
  deliveryFee: 3000,
  estimatedReadyAt: '2026-10-13T12:30:00+09:00',
  createdAt: '2026-10-13T12:10:00+09:00',
};

/** 갤러리 확인용 진행 중 배달 (배차 완료) */
export const RIDER_DELIVERY_MOCK: RiderDelivery = {
  deliveryId: 302,
  orderId: 1002,
  status: 'ASSIGNED',
  storeName: '김밥싹 성수점',
  pickupAddress: '서울 성동구 성수이로 120',
  deliveryAddress: '서울 성동구 아차산로 17, 302호',
  customerPhone: '010-1234-5678',
  riderRequest: '문 앞에 두고 벨 눌러 주세요',
  deliveryFee: 3000,
  estimatedReadyAt: '2026-10-13T12:30:00+09:00',
  assignedAt: '2026-10-13T12:15:00+09:00',
  pickedUpAt: null,
};

/**
 * 주문 ID로 목 배달을 찾는다.
 * @param orderId 주문 ID
 * @returns 배달 (없으면 null — API 404에 대응)
 */
export const getDeliveryMockByOrder = (orderId: number): Delivery | null =>
  DELIVERY_LIST_MOCK.find((delivery) => delivery.orderId === orderId) ?? null;
