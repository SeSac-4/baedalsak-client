import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getWaitingDeliveryList } from '../api/delivery-api';
import { deliveryKeys } from '../api/delivery-query';
import type { WaitingDelivery } from './delivery-types';

/**
 * 배차 대기 목록을 조회한다. 배차 대기 화면과 라이더 네비 건수 배지가 같은 캐시를 쓴다.
 * @returns 배차 대기 목록 쿼리 결과
 */
export const useWaitingDeliveryList = (): UseQueryResult<WaitingDelivery[]> =>
  useQuery({
    queryKey: deliveryKeys.waiting(),
    queryFn: getWaitingDeliveryList,
  });
