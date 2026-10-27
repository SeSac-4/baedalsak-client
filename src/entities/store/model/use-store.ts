import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getStore } from '../api/store-api';
import { storeKeys } from '../api/store-query';
import type { StoreDetail } from './store-types';

/**
 * 가게 상세를 조회한다.
 * @param storeId - 가게 ID
 * @returns 가게 상세 쿼리 결과
 */
export const useStore = (storeId: number): UseQueryResult<StoreDetail> =>
  useQuery({
    queryKey: storeKeys.detail(storeId),
    queryFn: () => getStore(storeId),
    enabled: Number.isInteger(storeId) && storeId > 0,
  });
