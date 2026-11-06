import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import { cartKeys } from '@/entities/cart';
import { orderKeys, type OrderDetail } from '@/entities/order';
import { paymentKeys } from '@/entities/payment';

import { confirmPayment } from '../api/confirm-payment-api';
import { paymentConfirmKeys } from '../api/confirm-payment-query';
import type { ConfirmPaymentRequest } from './confirm-payment-types';

/**
 * 결제 완료 화면 진입 시 결제를 한 번 확인한다.
 * 자동 재시도·재조회는 하지 않고, 결과를 모를 때(502 등)만 다시 시도 버튼으로 같은 paymentKey를 다시 보낸다 (서버 멱등).
 * 확인되면 결제·주문·장바구니(결제 완료 때 서버가 비움) 쿼리를 무효화해 다른 화면에 바로 반영되게 한다.
 * @param request - 주문 ID와 successUrl 쿼리 값, 없으면 호출하지 않음
 * @returns 결제 확인 쿼리 결과 (결제완료된 주문)
 */
export const useConfirmPayment = (request: ConfirmPaymentRequest | null): UseQueryResult<OrderDetail> => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: paymentConfirmKeys.byPaymentKey(request?.paymentKey ?? ''),
    queryFn: async (): Promise<OrderDetail> => {
      const order = await confirmPayment(request as ConfirmPaymentRequest);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: paymentKeys.all }),
        queryClient.invalidateQueries({ queryKey: orderKeys.all }),
        queryClient.invalidateQueries({ queryKey: cartKeys.all }),
      ]);
      return order;
    },
    enabled: request !== null,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
