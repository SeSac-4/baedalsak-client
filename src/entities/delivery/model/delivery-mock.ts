import type { RiderDelivery, WaitingDelivery } from './delivery-types';

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
