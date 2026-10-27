/** 메뉴 쿼리 키 팩토리 */
export const menuKeys = {
  all: ['menu'] as const,
  /**
   * 가게별 메뉴 목록 키를 만든다.
   * @param storeId - 가게 ID
   * @returns 쿼리 키
   */
  list: (storeId: number) => [...menuKeys.all, 'list', storeId] as const,
};
