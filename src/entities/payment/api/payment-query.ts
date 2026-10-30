/** 결제 쿼리 키 팩토리 */
export const paymentKeys = {
  all: ['payment'] as const,
  /**
   * 내 결제 목록 키를 만든다.
   * @returns 쿼리 키
   */
  list: () => [...paymentKeys.all, 'list'] as const,
  /**
   * 결제 상세 키를 만든다.
   * @param paymentId - 결제 ID
   * @returns 쿼리 키
   */
  detail: (paymentId: number) => [...paymentKeys.all, 'detail', paymentId] as const,
  /**
   * 주문의 결제 키를 만든다.
   * @param orderId - 주문 ID
   * @returns 쿼리 키
   */
  byOrder: (orderId: number) => [...paymentKeys.all, 'by-order', orderId] as const,
};
