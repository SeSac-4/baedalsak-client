/** 장바구니 쿼리 키 팩토리 */
export const cartKeys = {
  all: ['cart'] as const,
  /**
   * 내 장바구니 키를 만든다.
   * @returns 쿼리 키
   */
  detail: () => [...cartKeys.all, 'detail'] as const,
};
