import { apiClient } from '@/shared/api';

import type { PaymentDetail, PaymentPage } from '../model/payment-types';

/**
 * 내 결제 목록을 최신순으로 조회한다.
 * @param page - 페이지 번호 (0부터)
 * @param size - 페이지 크기
 * @returns 결제 목록 페이지
 */
export const getPaymentList = async (page: number, size: number): Promise<PaymentPage> => {
  const { data } = await apiClient.get<PaymentPage>('/payments', { params: { page, size } });
  return data;
};

/**
 * 결제 상세를 조회한다. 본인 결제가 아니면 403, 없으면 404 PAYMENT_NOT_FOUND.
 * @param paymentId - 결제 ID
 * @returns 결제 상세
 */
export const getPayment = async (paymentId: number): Promise<PaymentDetail> => {
  const { data } = await apiClient.get<PaymentDetail>(`/payments/${paymentId}`);
  return data;
};
