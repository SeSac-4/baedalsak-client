import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { PaymentReady } from '@/entities/payment';

import { createPayment } from '../api/request-payment-api';
import { paymentRequestKeys } from '../api/request-payment-query';

/**
 * 결제 화면 진입 시 결제 요청을 만들어 토스 결제창 호출 정보를 받는다.
 * 서버가 같은 주문에 같은 값을 돌려주므로(멱등) 새로고침·재진입 때 다시 호출한다.
 * @param orderId - 결제할 주문 ID
 * @returns 결제 요청 쿼리 결과
 */
export const usePaymentReady = (orderId: number): UseQueryResult<PaymentReady> =>
  useQuery({
    queryKey: paymentRequestKeys.byOrder(orderId),
    queryFn: () => createPayment(orderId),
    staleTime: 0,
  });
