import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getPaymentByOrder } from '../api/payment-api';
import { paymentKeys } from '../api/payment-query';
import type { PaymentDetail } from './payment-types';

/**
 * 주문의 결제를 조회한다. 결제가 아직 없으면(결제대기) data가 null.
 * @param orderId - 주문 ID
 * @returns 주문의 결제 쿼리 결과
 */
export const usePaymentByOrder = (orderId: number): UseQueryResult<PaymentDetail | null> =>
  useQuery({
    queryKey: paymentKeys.byOrder(orderId),
    queryFn: () => getPaymentByOrder(orderId),
    enabled: Number.isInteger(orderId) && orderId > 0,
  });
