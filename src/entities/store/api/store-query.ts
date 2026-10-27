import type { CategoryCode } from '@/entities/category/@x/store';

/** 가게 쿼리 키 팩토리 */
export const storeKeys = {
  all: ['store'] as const,
  /**
   * 가게 목록 키를 만든다.
   * @param category - 카테고리 코드 (전체면 undefined)
   * @returns 쿼리 키
   */
  list: (category?: CategoryCode) => [...storeKeys.all, 'list', category ?? 'ALL'] as const,
  /**
   * 가게 상세 키를 만든다.
   * @param storeId - 가게 ID
   * @returns 쿼리 키
   */
  detail: (storeId: number) => [...storeKeys.all, 'detail', storeId] as const,
};
