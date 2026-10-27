import { apiClient } from '@/shared/api';

import type { Menu } from '../model/menu-types';

/**
 * 가게 메뉴 목록을 조회한다. 삭제된 메뉴는 빠지고 품절은 포함된다.
 * @param storeId - 가게 ID
 * @returns 메뉴 목록
 */
export const getMenuList = async (storeId: number): Promise<Menu[]> => {
  const { data } = await apiClient.get<Menu[]>(`/stores/${storeId}/menus`);
  return data;
};
