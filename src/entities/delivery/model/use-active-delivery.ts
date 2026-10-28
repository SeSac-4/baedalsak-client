import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getActiveDelivery } from '../api/delivery-api';
import { deliveryKeys } from '../api/delivery-query';
import type { RiderDelivery } from './delivery-types';

/**
 * 내 진행 중 배달(라이더)을 조회한다. 진행 중 배달이 없으면 에러 코드 DELIVERY_NOT_FOUND(404)로 끝난다.
 * 진행 중 배달 화면·배차 대기 화면 진입 확인·라이더 라우트 가드가 같은 캐시를 쓴다.
 * @returns 진행 중 배달 쿼리 결과
 */
export const useActiveDelivery = (): UseQueryResult<RiderDelivery> =>
  useQuery({
    queryKey: deliveryKeys.active(),
    queryFn: getActiveDelivery,
  });
