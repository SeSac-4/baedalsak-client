import { useInfiniteQuery, type InfiniteData, type UseInfiniteQueryResult } from '@tanstack/react-query';

import { getWaitingDeliveryList } from '../api/delivery-api';
import { deliveryKeys } from '../api/delivery-query';
import type { WaitingDeliveryPage, WaitingSort } from './delivery-types';

/** 한 번에 불러오는 배차 대기 수 (서버 기본값과 같음) */
const WAITING_DELIVERY_PAGE_SIZE = 20;

/**
 * 배차 대기 목록을 정렬해 조회한다. 더 보기로 다음 페이지를 이어 붙인다. 정렬마다 캐시가 따로다.
 * @param sort - 정렬 (기본 빠른 배달순)
 * @returns 배차 대기 목록 무한 쿼리 결과
 */
export const useWaitingDeliveryList = (
  sort: WaitingSort = 'FASTEST',
): UseInfiniteQueryResult<InfiniteData<WaitingDeliveryPage>> =>
  useInfiniteQuery({
    queryKey: deliveryKeys.waiting(sort),
    queryFn: ({ pageParam }) => getWaitingDeliveryList(pageParam, WAITING_DELIVERY_PAGE_SIZE, sort),
    initialPageParam: 0,
    getNextPageParam: (lastPage: WaitingDeliveryPage): number | undefined =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
