/** 주문 상태: 결제대기 → 결제완료 → 조리중 → 배달중 → 배달완료 */
export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'COOKING' | 'DELIVERING' | 'DELIVERED';

/** 주문 항목 (주문 시점 스냅샷) */
export interface OrderItem {
  menuId: number;
  menuName: string;
  price: number;
  quantity: number;
}

/** GET /orders 응답 항목 (주문 목록 카드) */
export interface OrderSummary {
  id: number;
  storeName: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  /** ISO 8601 */
  createdAt: string;
}

/** GET /orders 응답. page는 0부터 */
export interface OrderPage {
  content: OrderSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** GET /orders/{orderId}·POST /orders 응답. 결제 정보는 GET /payments/by-order, 배정·픽업·완료 시각은 배달 API로 따로 받는다 */
export interface OrderDetail extends OrderSummary {
  storeId: number;
  deliveryAddress: string;
  storeRequest: string | null;
  riderRequest: string | null;
  itemsAmount: number;
  deliveryFee: number;
  /** ISO 8601, 수락 전이면 null */
  estimatedReadyAt: string | null;
  /** 배정된 라이더 이름 (배차 전이면 null) */
  riderName: string | null;
}
