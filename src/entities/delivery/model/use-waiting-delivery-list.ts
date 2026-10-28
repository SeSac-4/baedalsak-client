import { useInfiniteQuery, type InfiniteData, type UseInfiniteQueryResult } from '@tanstack/react-query';

import { getWaitingDeliveryList } from '../api/delivery-api';
import { deliveryKeys } from '../api/delivery-query';
import type { WaitingDeliveryPage } from './delivery-types';

/** 한 번에 불러오는 배차 대기 수 (서버 기본값과 같음) */
const WAITING_DELIVERY_PAGE_SIZE = 20;

/**
 * 배차 대기 목록을 오래된 순으로 조회한다. 더 보기로 다음 페이지를 이어 붙인다.
 * 배차 대기 화면과 라이더 네비 건수 배지(totalElements)가 같은 캐시를 쓴다.
 * @returns 배차 대기 목록 무한 쿼리 결과
 */
export const useWaitingDeliveryList = (): UseInfiniteQueryResult<InfiniteData<WaitingDeliveryPage>> =>
  useInfiniteQuery({
    queryKey: deliveryKeys.waiting(),
    queryFn: ({ pageParam }) => getWaitingDeliveryList(pageParam, WAITING_DELIVERY_PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage: WaitingDeliveryPage): number | undefined =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
