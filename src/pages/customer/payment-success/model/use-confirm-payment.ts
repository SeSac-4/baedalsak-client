import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import { paymentKeys, type PaymentDetail } from '@/entities/payment';

import { confirmPayment } from '../api/confirm-payment-api';
import { paymentConfirmKeys } from '../api/confirm-payment-query';
import type { ConfirmPaymentRequest } from './confirm-payment-types';

/**
 * 결제 완료 화면 진입 시 결제를 한 번 승인한다.
 * 승인은 다시 보내면 이중 승인 위험이 있어 자동 재시도·재조회를 하지 않고, 재시도 버튼으로만 다시 호출한다.
 * 승인되면 결제 목록·상세 쿼리를 무효화해 결제내역에 바로 보이게 한다.
 * @param request - successUrl 쿼리 값, 없으면 호출하지 않음
 * @returns 결제 승인 쿼리 결과
 */
export const useConfirmPayment = (request: ConfirmPaymentRequest | null): UseQueryResult<PaymentDetail> => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: paymentConfirmKeys.byPaymentKey(request?.paymentKey ?? ''),
    queryFn: async (): Promise<PaymentDetail> => {
      const payment = await confirmPayment(request as ConfirmPaymentRequest);
      await queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      return payment;
    },
    enabled: request !== null,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
