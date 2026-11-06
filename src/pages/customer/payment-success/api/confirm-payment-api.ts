import type { OrderDetail } from '@/entities/order';
import { apiClient } from '@/shared/api';

import type { ConfirmPaymentRequest } from '../model/confirm-payment-types';

/** 결제 확인 요청 시간 제한. 서버(조정자) 처리 약 21초보다 길게 둔다 (설계서 '변경 이력' 결제 확인 시간 예산) */
const CONFIRM_TIMEOUT_MS = 25_000;

/**
 * 토스 결제 결과로 주문의 결제를 확인한다. 조정자(order)가 가게·메뉴를 다시 확인하고 결제를 승인한 뒤,
 * 결제완료가 된 주문을 돌려준다. 이미 결제완료 이후 상태면 다시 승인하지 않고 200으로 응답한다.
 * @param request - 주문 ID와 successUrl로 받은 paymentKey·amount
 * @returns 결제완료된 주문 상세
 */
export const confirmPayment = async ({ orderId, paymentKey, amount }: ConfirmPaymentRequest): Promise<OrderDetail> => {
  const { data } = await apiClient.post<OrderDetail>(
    `/orders/${orderId}/payment/confirm`,
    { paymentKey, amount },
    { timeout: CONFIRM_TIMEOUT_MS },
  );
  return data;
};
