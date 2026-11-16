import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getCurrentPosition } from '../geolocation';
import type { LatLngLiteral } from './geocode-address';
import { getRegion, type Region } from './get-region';

/** 현재 위치 캐시 키 */
export const currentLocationKeys = {
  all: ['current-location'] as const,
};

/** 현재 위치 (좌표 + 동네) */
export interface CurrentLocation {
  position: LatLngLiteral;
  /** 동네. 국외이거나 카카오에서 못 찾으면 null */
  region: Region | null;
}

/** 위치를 다시 확인하지 않는 시간 (ms). 배달 앱 이용 중에는 거의 안 바뀐다 */
const LOCATION_STALE_MS = 5 * 60_000;

/**
 * 좌표의 동네를 찾는다. 동네를 못 찾아도 좌표는 쓸 수 있도록 실패하면 null 을 돌려준다.
 * @param position - 좌표
 * @returns 동네 (못 찾으면 null)
 */
const getRegionOrNull = (position: LatLngLiteral): Promise<Region | null> => getRegion(position).catch(() => null);

/**
 * 브라우저 위치로 현재 좌표와 동네를 구한다. 권한 거부 등 실패하면 재시도하지 않고, refetch 로 다시 묻는다.
 * @returns 현재 위치 쿼리 결과
 */
export const useCurrentLocation = (): UseQueryResult<CurrentLocation> =>
  useQuery({
    queryKey: currentLocationKeys.all,
    queryFn: async (): Promise<CurrentLocation> => {
      const position = await getCurrentPosition();
      return { position, region: await getRegionOrNull(position) };
    },
    staleTime: LOCATION_STALE_MS,
    retry: false,
    refetchOnWindowFocus: false,
  });
