import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { cartKeys, type Cart } from '@/entities/cart';
import { getErrorMessage } from '@/shared/api';
import { useToast } from '@/shared/ui/toast';

import { removeCartItem } from '../api/cart-item-api';

/**
 * 장바구니 항목 삭제. 응답 장바구니로 캐시를 바로 바꾸고, 실패하면 서버 메시지를 토스트로 보여 준다.
 * @returns 항목 삭제 mutation (인자: 메뉴 ID)
 */
export const useRemoveCartItem = (): UseMutationResult<Cart, unknown, number> => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: (cart: Cart): void => {
      queryClient.setQueryData(cartKeys.detail(), cart);
    },
    onError: (error: unknown): void => {
      toast(getErrorMessage(error));
    },
  });
};
