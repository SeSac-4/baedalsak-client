/** 카테고리 쿼리 키 팩토리 */
export const categoryKeys = {
  all: ['category'] as const,
  /**
   * 카테고리 목록 키를 만든다.
   * @returns 쿼리 키
   */
  list: () => [...categoryKeys.all, 'list'] as const,
};
