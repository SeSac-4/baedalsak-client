import { apiClient, getErrorCode } from '@/shared/api';

import type { PaymentDetail, PaymentPage } from '../model/payment-types';

/** 주문에 결제 요청이 아직 없을 때(결제창을 연 적 없는 주문) 주문의 결제 조회가 돌려주는 404 코드 */
const PAYMENT_NOT_FOUND = 'PAYMENT_NOT_FOUND';

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

/**
 * 주문의 결제를 조회한다. (주문 상세의 결제 상세 링크용) 본인 주문이 아니면 403.
 * @param orderId - 주문 ID
 * @returns 결제 상세 (결제창만 열고 닫은 주문은 REQUESTED 결제, 결제 요청이 아직 없으면 404 PAYMENT_NOT_FOUND → null)
 */
export const getPaymentByOrder = async (orderId: number): Promise<PaymentDetail | null> => {
  try {
    const { data } = await apiClient.get<PaymentDetail>(`/payments/by-order/${orderId}`);
    return data;
  } catch (error: unknown) {
    if (getErrorCode(error) === PAYMENT_NOT_FOUND) return null;
    throw error;
  }
};
