/** 결제 승인 쿼리 키 팩토리 */
export const paymentConfirmKeys = {
  all: ['payment-confirm'] as const,
  /**
   * 토스 결제 키별 승인 키를 만든다.
   * @param paymentKey - 토스 결제 키
   * @returns 쿼리 키
   */
  byPaymentKey: (paymentKey: string) => [...paymentConfirmKeys.all, paymentKey] as const,
};
