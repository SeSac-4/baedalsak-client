import { apiClient } from '@/shared/api';

import type { Category } from '../model/category-types';

/**
 * 고정 카테고리 목록을 조회한다.
 * @returns 카테고리 목록
 */
export const getCategoryList = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>('/categories');
  return data;
};
