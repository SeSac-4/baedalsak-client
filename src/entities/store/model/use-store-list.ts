import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { CategoryCode } from '@/entities/category/@x/store';

import { getStoreList } from '../api/store-api';
import { storeKeys } from '../api/store-query';
import type { StoreSummary } from './store-types';

/**
 * 가게 목록을 조회한다.
 * @param category - 카테고리 코드 (전체면 undefined)
 * @returns 가게 목록 쿼리 결과
 */
export const useStoreList = (category?: CategoryCode): UseQueryResult<StoreSummary[]> =>
  useQuery({
    queryKey: storeKeys.list(category),
    queryFn: () => getStoreList(category),
  });
