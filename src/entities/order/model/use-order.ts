import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getOrder } from '../api/order-api';
import { orderKeys } from '../api/order-query';
import type { OrderDetail } from './order-types';

/**
 * 주문 상세를 조회한다.
 * @param orderId - 주문 ID
 * @returns 주문 상세 쿼리 결과
 */
export const useOrder = (orderId: number): UseQueryResult<OrderDetail> =>
  useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrder(orderId),
    enabled: Number.isInteger(orderId) && orderId > 0,
  });
