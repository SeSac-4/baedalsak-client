/** 결제 요청 쿼리 키 팩토리 */
export const paymentRequestKeys = {
  all: ['payment-request'] as const,
  /**
   * 주문별 결제 요청 키를 만든다.
   * @param orderId - 주문 ID
   * @returns 쿼리 키
   */
  byOrder: (orderId: number) => [...paymentRequestKeys.all, orderId] as const,
};
