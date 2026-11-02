import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { orderKeys, type OrderDetail } from '@/entities/order';

import { acceptOrder } from '../api/accept-order-api';

/** 주문 수락 인자 */
export interface AcceptOrderVariables {
  orderId: number;
  estimatedMinutes: number;
}

/**
 * 주문 수락. 성공·실패와 관계없이 가게 주문 목록·주문 상세를 다시 받는다 (409면 이미 다른 상태라 목록을 맞춰야 함).
 * 안내 문구·탭 이동은 수락 모달이 맡는다.
 * @returns 주문 수락 mutation
 */
export const useAcceptOrder = (): UseMutationResult<OrderDetail, unknown, AcceptOrderVariables> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, estimatedMinutes }: AcceptOrderVariables) => acceptOrder(orderId, estimatedMinutes),
    onSettled: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};
