import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getDeliveryRoute } from '../api/delivery-api';
import { deliveryKeys } from '../api/delivery-query';
import type { DeliveryRoute } from './delivery-types';

/** 픽업 직후에는 서버가 길찾기 중이라 경로가 아직 없을 수 있다 → 생길 때까지 다시 묻는 주기 */
const ROUTE_RETRY_MS = 3_000;

/**
 * 주문의 배달 경로를 조회한다. 경로는 픽업 때 한 번 정해지고 바뀌지 않으므로 다시 받지 않는다.
 * 아직 없으면(null) 생길 때까지 주기적으로 다시 묻는다.
 * @param orderId - 주문 ID
 * @param enabled - 조회 여부 (픽업 중일 때만 켠다)
 * @returns 경로 쿼리 결과 (경로가 없으면 data가 null)
 */
export const useDeliveryRoute = (orderId: number, enabled: boolean): UseQueryResult<DeliveryRoute | null> =>
  useQuery({
    queryKey: deliveryKeys.route(orderId),
    queryFn: () => getDeliveryRoute(orderId),
    enabled: enabled && Number.isInteger(orderId) && orderId > 0,
    staleTime: Infinity,
    refetchInterval: (query) => (query.state.data === null ? ROUTE_RETRY_MS : false),
  });
