import { useInfiniteQuery, type InfiniteData, type UseInfiniteQueryResult } from '@tanstack/react-query';

import { getStoreOrderList } from '../api/order-api';
import { orderKeys } from '../api/order-query';
import type { OrderStatus, StoreOrderPage } from './order-types';

/**
 * 다음에 받을 페이지 번호를 고른다.
 * @param lastPage - 마지막으로 받은 페이지
 * @returns 다음 페이지 번호 (더 없으면 undefined)
 */
const getNextPageParam = (lastPage: StoreOrderPage): number | undefined =>
  lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined;

/**
 * 가게 주문 목록(사장님)을 상태별로 조회한다. '더 보기'로 다음 페이지를 이어 받는다.
 * @param storeId - 가게 ID
 * @param statuses - 조회할 주문 상태
 * @returns 가게 주문 목록 무한 쿼리 결과
 */
export const useStoreOrderList = (
  storeId: number,
  statuses: OrderStatus[],
): UseInfiniteQueryResult<InfiniteData<StoreOrderPage, number>> =>
  useInfiniteQuery({
    queryKey: orderKeys.storeList(storeId, statuses),
    queryFn: ({ pageParam }: { pageParam: number }) => getStoreOrderList(storeId, statuses, pageParam),
    initialPageParam: 0,
    getNextPageParam,
    enabled: Number.isInteger(storeId) && storeId > 0,
  });
