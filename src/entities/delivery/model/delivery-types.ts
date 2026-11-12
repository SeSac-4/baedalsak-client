/** 배달 상태: 배차대기 → 배차완료 → 픽업완료 → 배달완료 */
export type DeliveryStatus = 'WAITING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED';

/** 위경도 좌표. 서버가 카카오 주소 변환으로 채운다 (카카오맵 좌표 형식과 같음) */
export interface DeliveryPoint {
  lat: number;
  lng: number;
}

/** GET /deliveries/by-order/{orderId}(배달 생성 전이면 204)·POST /deliveries/{deliveryId}/complete 응답. 고객 연락처는 없음 */
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
  /** 가게 좌표. 주소 변환 전·실패면 null */
  pickupPoint?: DeliveryPoint | null;
  /** 배달지 좌표. 주소 변환 전·실패면 null */
  deliveryPoint?: DeliveryPoint | null;
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
  /** 가게 좌표 (배차 전이라 배달지 좌표는 없음). 주소 변환 전·실패면 null */
  pickupPoint?: DeliveryPoint | null;
}

/** GET /deliveries/waiting 응답. page는 0부터 */
export interface WaitingDeliveryPage {
  content: WaitingDelivery[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** GET /deliveries/me/active(없으면 204)·POST /deliveries/{deliveryId}/accept·pickup 응답. 배정된 라이더에게만 상세 주소 공개 */
export interface RiderDelivery {
  deliveryId: number;
  orderId: number;
  status: DeliveryStatus;
  storeName: string;
  pickupAddress: string;
  deliveryAddress: string;
  /** 고객 연락처. 진행 중 배달 조회(GET /me/active)에만 있고, 수락·픽업 응답에는 없음 */
  customerPhone?: string;
  /** 라이더 요청사항 (없으면 null) */
  riderRequest: string | null;
  deliveryFee: number;
  /** ISO 8601, 조리 완료 예상 시각 */
  estimatedReadyAt: string;
  /** ISO 8601 */
  assignedAt: string | null;
  /** ISO 8601 */
  pickedUpAt: string | null;
  /** 가게 좌표. 주소 변환 전·실패면 null */
  pickupPoint?: DeliveryPoint | null;
  /** 배달지 좌표. 주소 변환 전·실패면 null */
  deliveryPoint?: DeliveryPoint | null;
}

/** GET /deliveries/by-order/{orderId}/route 응답 (픽업 전이면 204). 가게 → 배달지 경로 */
export interface DeliveryRoute {
  deliveryId: number;
  /** 경로 좌표 (가게 → 배달지 순서) */
  path: DeliveryPoint[];
  /** 전체 거리 (m) */
  distanceM: number;
  /** 예상 소요 시간 (초) */
  durationS: number;
  /** 길찾기 실패로 가게·배달지를 직선으로 이었으면 true */
  straight: boolean;
}

/** 위치 출처: 서버 가상 GPS · 라이더 앱 실제 GPS */
export type RiderLocationSource = 'VIRTUAL' | 'REAL';

/** 라이더 현재 위치. 도착(arrived)은 배달 상태가 아니다 — 완료는 라이더가 완료 버튼을 눌러야 된다 */
export interface RiderLocation {
  lat: number;
  lng: number;
  /** 경로를 따라 배달지까지 남은 거리 (m). 경로를 모르면 null */
  remainingDistanceM: number | null;
  /** ISO 8601 도착 예정 시각. 도착 후에는 도착 시각. 경로를 모르면 null */
  etaAt: string | null;
  /** 배달지 도착 여부 */
  arrived: boolean;
  /** ISO 8601 처음 도착한 시각 */
  arrivedAt: string | null;
  /** ISO 8601 이 위치를 받은 시각 */
  updatedAt: string;
  source: RiderLocationSource;
}

/** GET /deliveries/by-order/{orderId}/location 응답 (배달 생성 전이면 204). 2초마다 폴링 */
export interface DeliveryLocation {
  deliveryId: number;
  orderId: number;
  status: DeliveryStatus;
  /** 픽업 중(PICKED_UP)에만 있음. 픽업 전·완료 후·첫 위치 전이면 null */
  location: RiderLocation | null;
}
