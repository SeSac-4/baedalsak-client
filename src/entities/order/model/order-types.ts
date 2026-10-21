/** 주문 상태: 결제대기 → 결제완료 → 조리중 → 배달중 → 배달완료 */
export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'COOKING' | 'DELIVERING' | 'DELIVERED';

/** 주문 항목 (주문 시점 스냅샷) */
export interface OrderItem {
  menuId: number;
  menuName: string;
  price: number;
  quantity: number;
}

/** GET /orders 응답 항목 */
export interface OrderSummary {
  id: number;
  storeName: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  /** ISO 8601 */
  createdAt: string;
}

/** 상태 변경 이력 (스텝퍼 시각 표시용, 서버 제공 가정) */
export interface OrderStatusHistory {
  status: OrderStatus;
  /** ISO 8601 */
  at: string;
}

/** GET /orders/{orderId} 응답 */
export interface OrderDetail extends OrderSummary {
  storeId: number;
  paymentId: number | null;
  deliveryAddress: string;
  storeRequest: string | null;
  riderRequest: string | null;
  itemsAmount: number;
  deliveryFee: number;
  /** ISO 8601, 수락 전이면 null */
  estimatedReadyAt: string | null;
  statusHistory: OrderStatusHistory[];
}
