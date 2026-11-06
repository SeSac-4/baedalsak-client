/**
 * 주문 상태: 결제대기 → 결제완료 → 조리중 → 배달중 → 배달완료.
 * 결제완료에서 주문거절·주문취소로, 결제대기에서 결제만료로 끝날 수 있다.
 * 결제대기·결제만료는 서버가 고객 조회와 사장님 목록에서 뺀다.
 */
export type OrderStatus =
  'PENDING_PAYMENT' | 'PAID' | 'COOKING' | 'DELIVERING' | 'DELIVERED' | 'PAYMENT_EXPIRED' | 'REJECTED' | 'CANCELED';

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

/** GET /stores/{storeId}/orders 응답 (사장님). 결제대기 주문은 서버가 항상 뺀다. page는 0부터 */
export interface StoreOrderPage {
  content: OrderDetail[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
