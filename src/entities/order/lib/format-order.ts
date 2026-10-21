import type { BadgeTone } from '@/shared/ui/badge';

import type { OrderItem, OrderStatus } from '../model/order-types';

/** 주문 진행 순서 (스텝퍼 단계) */
export const ORDER_STATUS_FLOW: OrderStatus[] = ['PENDING_PAYMENT', 'PAID', 'COOKING', 'DELIVERING', 'DELIVERED'];

/** 주문 상태 표시명 */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: '결제대기',
  PAID: '결제완료',
  COOKING: '조리중',
  DELIVERING: '배달중',
  DELIVERED: '배달완료',
};

/** 주문 상태 배지 톤 (CMP-05) */
export const ORDER_STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  PENDING_PAYMENT: 'warn',
  PAID: 'info',
  COOKING: 'ok',
  DELIVERING: 'info',
  DELIVERED: 'muted',
};

/**
 * 주문 항목을 '메뉴 수량' 요약 문자열로 바꾼다.
 * @param items 주문 항목
 * @returns 예: 참치김밥 2, 라볶이 1
 */
export const formatOrderItems = (items: OrderItem[]): string =>
  items.map((item) => `${item.menuName} ${item.quantity}`).join(', ');
