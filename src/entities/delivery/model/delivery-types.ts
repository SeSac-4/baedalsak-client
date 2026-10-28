/** 배달 상태: 배차대기 → 배차완료 → 픽업완료 → 배달완료 */
export type DeliveryStatus = 'WAITING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED';

/** GET /deliveries/by-order/{orderId}·POST /deliveries/{deliveryId}/complete 응답. 고객 연락처는 없음 */
export interface Delivery {
  deliveryId: number;
  orderId: number;
  status: DeliveryStatus;
  storeName: string;
  /** 배차 전이면 null */
  riderId: number | null;
  /** 배차 전이면 null */
  riderName: string | null;
  /** ISO 8601 */
  assignedAt: string | null;
  /** ISO 8601 */
  pickedUpAt: string | null;
  /** ISO 8601 */
  completedAt: string | null;
}

/** GET /deliveries/waiting 응답 항목. 배차 전이라 배달지는 동 단위만, 고객 연락처 없음 */
export interface WaitingDelivery {
  deliveryId: number;
  storeName: string;
  pickupAddress: string;
  /** 배달지 동 (예: 성수동) */
  deliveryDong: string;
  deliveryFee: number;
  /** ISO 8601, 조리 완료 예상 시각 */
  estimatedReadyAt: string;
  /** ISO 8601 */
  createdAt: string;
}

/** GET /deliveries/me/active·POST /deliveries/{deliveryId}/accept·pickup 응답. 배정된 라이더에게만 상세 주소·연락처 공개 */
export interface RiderDelivery {
  deliveryId: number;
  orderId: number;
  status: DeliveryStatus;
  storeName: string;
  pickupAddress: string;
  deliveryAddress: string;
  customerPhone: string;
  /** 라이더 요청사항 (없으면 null) */
  riderRequest: string | null;
  deliveryFee: number;
  /** ISO 8601, 조리 완료 예상 시각 */
  estimatedReadyAt: string;
  /** ISO 8601 */
  assignedAt: string | null;
  /** ISO 8601 */
  pickedUpAt: string | null;
}
