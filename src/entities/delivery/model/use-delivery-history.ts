import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getDeliveryHistory } from '../api/delivery-api';
import { deliveryKeys } from '../api/delivery-query';
import type { RiderDeliveryHistory } from './delivery-types';

/**
 * 내가 기간 안에 완료한 배달(라이더)을 조회한다.
 * @param from - 시작 날짜 (YYYY-MM-DD, 포함)
 * @param to - 끝 날짜 (YYYY-MM-DD, 포함)
 * @returns 배달 내역 쿼리 결과
 */
export const useDeliveryHistory = (from: string, to: string): UseQueryResult<RiderDeliveryHistory[]> =>
  useQuery({
    queryKey: deliveryKeys.history(from, to),
    queryFn: () => getDeliveryHistory(from, to),
  });
