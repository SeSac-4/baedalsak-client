import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getPayment } from '../api/payment-api';
import { paymentKeys } from '../api/payment-query';
import type { PaymentDetail } from './payment-types';

/**
 * 결제 상세를 조회한다.
 * @param paymentId - 결제 ID
 * @returns 결제 상세 쿼리 결과
 */
export const usePayment = (paymentId: number): UseQueryResult<PaymentDetail> =>
  useQuery({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: () => getPayment(paymentId),
    enabled: Number.isInteger(paymentId) && paymentId > 0,
  });
