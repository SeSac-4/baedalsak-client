import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getCurrentPosition } from '../geolocation';
import { getRegion, type Region } from './get-region';

/** 현재 동네 캐시 키 */
export const currentRegionKeys = {
  all: ['current-region'] as const,
};

/** 동네를 다시 확인하지 않는 시간 (ms). 배달 앱 이용 중에는 거의 안 바뀐다 */
const REGION_STALE_MS = 5 * 60_000;

/**
 * 브라우저 위치로 현재 동네를 구한다. 권한 거부 등 실패하면 재시도하지 않고, refetch 로 다시 묻는다.
 * @returns 현재 동네 쿼리 결과 (못 찾으면 data가 null)
 */
export const useCurrentRegion = (): UseQueryResult<Region | null> =>
  useQuery({
    queryKey: currentRegionKeys.all,
    queryFn: async (): Promise<Region | null> => getRegion(await getCurrentPosition()),
    staleTime: REGION_STALE_MS,
    retry: false,
    refetchOnWindowFocus: false,
  });
