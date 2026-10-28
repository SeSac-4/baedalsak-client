import { useInfiniteQuery, type InfiniteData, type UseInfiniteQueryResult } from '@tanstack/react-query';

import { getPaymentList } from '../api/payment-api';
import { paymentKeys } from '../api/payment-query';
import type { PaymentPage } from './payment-types';

/** 한 번에 불러오는 결제 수 (서버 기본값과 같음) */
const PAYMENT_PAGE_SIZE = 20;

/**
 * 내 결제 목록을 최신순으로 조회한다. 더 보기로 다음 페이지를 이어 붙인다.
 * @returns 결제 목록 무한 쿼리 결과
 */
export const usePaymentList = (): UseInfiniteQueryResult<InfiniteData<PaymentPage>> =>
  useInfiniteQuery({
    queryKey: paymentKeys.list(),
    queryFn: ({ pageParam }) => getPaymentList(pageParam, PAYMENT_PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PaymentPage): number | undefined =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
