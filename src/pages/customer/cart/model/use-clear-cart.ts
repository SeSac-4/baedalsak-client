import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { cartKeys } from '@/entities/cart';
import { getErrorMessage } from '@/shared/api';
import { useToast } from '@/shared/ui/toast';

import { clearCart } from '../api/clear-cart-api';

const CLEARED_MESSAGE = '장바구니를 비웠어요.';

/**
 * 장바구니 비우기. 성공하면 장바구니 쿼리를 invalidate하고, 실패하면 서버 메시지를 토스트로 보여 준다.
 * @returns 비우기 mutation
 */
export const useClearCart = (): UseMutationResult<void, unknown, void> => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: async (): Promise<void> => {
      toast(CLEARED_MESSAGE);
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error: unknown): void => {
      toast(getErrorMessage(error));
    },
  });
};
