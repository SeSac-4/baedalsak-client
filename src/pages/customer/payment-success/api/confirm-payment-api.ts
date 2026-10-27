import type { PaymentDetail } from '@/entities/payment';
import { apiClient } from '@/shared/api';

import type { ConfirmPaymentRequest } from '../model/confirm-payment-types';

/**
 * 토스 결제 결과로 결제를 승인한다. 이미 승인된 결제면 서버가 409로 응답한다.
 * @param request - successUrl로 받은 paymentKey·orderId(tossOrderId)·amount
 * @returns 승인된 결제 상세
 */
export const confirmPayment = async (request: ConfirmPaymentRequest): Promise<PaymentDetail> => {
  const { data } = await apiClient.post<PaymentDetail>('/payments/confirm', request);
  return data;
};
