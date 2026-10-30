import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { cartKeys, type Cart } from '@/entities/cart';
import { getErrorMessage } from '@/shared/api';
import { useToast } from '@/shared/ui/toast';

import { updateCartItem } from '../api/cart-item-api';

/** 수량 변경 인자 */
export interface UpdateCartItemVariables {
  menuId: number;
  quantity: number;
}

/**
 * 장바구니 수량 변경. 응답 장바구니로 캐시를 바로 바꾸고, 실패하면 서버 메시지를 토스트로 보여 준다.
 * @returns 수량 변경 mutation
 */
export const useUpdateCartItem = (): UseMutationResult<Cart, unknown, UpdateCartItemVariables> => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ menuId, quantity }: UpdateCartItemVariables) => updateCartItem(menuId, quantity),
    onSuccess: (cart: Cart): void => {
      queryClient.setQueryData(cartKeys.detail(), cart);
    },
    onError: (error: unknown): void => {
      toast(getErrorMessage(error));
    },
  });
};
