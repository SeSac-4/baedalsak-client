import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { LatLngLiteral } from '@/shared/lib/kakao-map';

import { getStoreListSummary } from '../api/store-api';
import { storeKeys } from '../api/store-query';
import type { StoreListSummary } from './store-types';

/**
 * 가게 목록 통계를 조회한다. 위치가 바뀌는 동안 이전 통계를 보여 준다.
 * @param position - 내 위치 (있으면 반경 안의 가게 기준)
 * @returns 가게 목록 통계 쿼리 결과
 */
export const useStoreListSummary = (position?: LatLngLiteral): UseQueryResult<StoreListSummary> =>
  useQuery({
    queryKey: storeKeys.summary(position),
    queryFn: () => getStoreListSummary(position),
    placeholderData: keepPreviousData,
  });
