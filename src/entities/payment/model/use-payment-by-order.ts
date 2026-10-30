import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getPaymentByOrder } from '../api/payment-api';
import { paymentKeys } from '../api/payment-query';
import type { PaymentDetail } from './payment-types';

/**
 * 주문의 결제를 조회한다. 결제 요청이 아직 없으면(결제창을 연 적 없는 주문) data가 null, 결제창만 열고 닫았으면 REQUESTED 결제.
 * @param orderId - 주문 ID
 * @returns 주문의 결제 쿼리 결과
 */
export const usePaymentByOrder = (orderId: number): UseQueryResult<PaymentDetail | null> =>
  useQuery({
    queryKey: paymentKeys.byOrder(orderId),
    queryFn: () => getPaymentByOrder(orderId),
    enabled: Number.isInteger(orderId) && orderId > 0,
  });
