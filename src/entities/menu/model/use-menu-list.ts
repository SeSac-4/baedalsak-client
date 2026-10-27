import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getMenuList } from '../api/menu-api';
import { menuKeys } from '../api/menu-query';
import type { Menu } from './menu-types';

/**
 * 가게 메뉴 목록을 조회한다.
 * @param storeId - 가게 ID
 * @returns 메뉴 목록 쿼리 결과
 */
export const useMenuList = (storeId: number): UseQueryResult<Menu[]> =>
  useQuery({
    queryKey: menuKeys.list(storeId),
    queryFn: () => getMenuList(storeId),
    enabled: Number.isInteger(storeId) && storeId > 0,
  });
