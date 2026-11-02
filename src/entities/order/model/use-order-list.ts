import { useInfiniteQuery, type InfiniteData, type UseInfiniteQueryResult } from '@tanstack/react-query';

import { getOrderList } from '../api/order-api';
import { orderKeys } from '../api/order-query';
import type { OrderPage } from './order-types';

/**
 * 다음에 받을 페이지 번호를 고른다.
 * @param lastPage - 마지막으로 받은 페이지
 * @returns 다음 페이지 번호 (더 없으면 undefined)
 */
const getNextPageParam = (lastPage: OrderPage): number | undefined =>
  lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined;

/**
 * 내 주문 목록을 최신순으로 조회한다. '더 보기'로 다음 페이지를 이어 받는다.
 * @returns 주문 목록 무한 쿼리 결과
 */
export const useOrderList = (): UseInfiniteQueryResult<InfiniteData<OrderPage, number>> =>
  useInfiniteQuery({
    queryKey: orderKeys.list(),
    queryFn: ({ pageParam }: { pageParam: number }) => getOrderList(pageParam),
    initialPageParam: 0,
    getNextPageParam,
  });
