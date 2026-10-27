import type { PaymentReady } from '@/entities/payment';
import { apiClient } from '@/shared/api';

/**
 * 결제 요청을 만들고 토스 결제창 호출 정보를 받는다. 같은 주문이면 서버가 기존 결제 요청을 돌려준다.
 * @param orderId - 결제할 주문 ID
 * @returns 결제 요청 정보 (paymentId·tossOrderId·orderName·amount)
 */
export const createPayment = async (orderId: number): Promise<PaymentReady> => {
  const { data } = await apiClient.post<PaymentReady>('/payments', { orderId });
  return data;
};
