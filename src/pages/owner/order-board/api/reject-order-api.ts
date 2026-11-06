import type { OrderDetail } from '@/entities/order';
import { apiClient } from '@/shared/api';

/**
 * 주문을 거절한다. 결제완료 → 주문거절, 환불은 서버가 뒤에서 진행한다. 이미 처리된 주문이면 409 ORDER_INVALID_STATUS.
 * @param orderId - 주문 ID
 * @returns 거절한 주문 상세
 */
export const rejectOrder = async (orderId: number): Promise<OrderDetail> => {
  const { data } = await apiClient.post<OrderDetail>(`/orders/${orderId}/reject`);
  return data;
};
