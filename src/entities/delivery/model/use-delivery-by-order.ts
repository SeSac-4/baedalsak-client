import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getDeliveryByOrder } from '../api/delivery-api';
import { deliveryKeys } from '../api/delivery-query';
import type { Delivery } from './delivery-types';

/**
 * 주문의 배달 상태를 조회한다. 배달이 아직 만들어지기 전이면 에러 코드 DELIVERY_NOT_FOUND(404)로 끝난다.
 * @param orderId - 주문 ID
 * @returns 배달 상태 쿼리 결과
 */
export const useDeliveryByOrder = (orderId: number): UseQueryResult<Delivery> =>
  useQuery({
    queryKey: deliveryKeys.byOrder(orderId),
    queryFn: () => getDeliveryByOrder(orderId),
    enabled: Number.isInteger(orderId) && orderId > 0,
  });
