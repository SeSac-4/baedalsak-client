import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getStoreListSummary } from '../api/store-api';
import { storeKeys } from '../api/store-query';
import type { StoreListSummary } from './store-types';

/**
 * 가게 목록 통계를 조회한다.
 * @returns 가게 목록 통계 쿼리 결과
 */
export const useStoreListSummary = (): UseQueryResult<StoreListSummary> =>
  useQuery({
    queryKey: storeKeys.summary(),
    queryFn: getStoreListSummary,
  });
