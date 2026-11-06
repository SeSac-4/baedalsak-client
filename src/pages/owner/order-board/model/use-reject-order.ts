import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { orderKeys, type OrderDetail } from '@/entities/order';

import { rejectOrder } from '../api/reject-order-api';

/**
 * 주문 거절. 성공·실패와 관계없이 가게 주문 목록·주문 상세를 다시 받는다 (409면 이미 다른 상태라 목록을 맞춰야 함).
 * 안내 문구는 거절 모달이 맡는다.
 * @returns 주문 거절 mutation (인자: 주문 ID)
 */
export const useRejectOrder = (): UseMutationResult<OrderDetail, unknown, number> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectOrder,
    onSettled: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};
