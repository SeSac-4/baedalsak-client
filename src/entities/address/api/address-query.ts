/** 배달 주소 쿼리 키 팩토리 */
export const addressKeys = {
  all: ['address'] as const,
  /**
   * 내 주소 목록 키를 만든다.
   * @returns 쿼리 키
   */
  list: () => [...addressKeys.all, 'list'] as const,
};
