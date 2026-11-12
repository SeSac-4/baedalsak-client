import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getMyRiderPosition } from '../api/delivery-api';
import { deliveryKeys } from '../api/delivery-query';
import type { DeliveryPoint } from './delivery-types';

/**
 * 내 현재 위치를 조회한다. (라이더) 픽업 전에는 위치가 움직이지 않아 폴링하지 않는다.
 * 수락·완료 때 배달 키 전체를 다시 불러오므로 배달을 마친 자리도 그때 반영된다.
 * @returns 현재 위치 쿼리 결과 (모르면 data가 null)
 */
export const useMyRiderPosition = (): UseQueryResult<DeliveryPoint | null> =>
  useQuery({
    queryKey: deliveryKeys.myPosition(),
    queryFn: getMyRiderPosition,
  });
