import type { OrderDetail } from '@/entities/order';
import { apiClient } from '@/shared/api';

/**
 * 주문을 수락한다. 결제완료 → 조리중, 조리 완료 예상 = 지금 + 조리 예상 분. 이미 처리된 주문이면 409 ORDER_INVALID_STATUS.
 * @param orderId - 주문 ID
 * @param estimatedMinutes - 조리 예상 시간(분, 1 이상)
 * @returns 수락한 주문 상세
 */
export const acceptOrder = async (orderId: number, estimatedMinutes: number): Promise<OrderDetail> => {
  const { data } = await apiClient.post<OrderDetail>(`/orders/${orderId}/accept`, { estimatedMinutes });
  return data;
};
