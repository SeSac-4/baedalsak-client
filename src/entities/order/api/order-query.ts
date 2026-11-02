/** 주문 쿼리 키 팩토리 */
export const orderKeys = {
  all: ['order'] as const,
  /**
   * 내 주문 목록 키를 만든다.
   * @returns 쿼리 키
   */
  list: () => [...orderKeys.all, 'list'] as const,
  /**
   * 주문 상세 키를 만든다.
   * @param orderId - 주문 ID
   * @returns 쿼리 키
   */
  detail: (orderId: number) => [...orderKeys.all, 'detail', orderId] as const,
};
