import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { cartKeys } from '@/entities/cart';
import { getErrorCode, getErrorMessage } from '@/shared/api';
import { useToast } from '@/shared/ui/toast';

import { addCartItem, type AddCartItemRequest } from '../api/add-to-cart-api';

const CART_DIFFERENT_STORE = 'CART_DIFFERENT_STORE';
const ADDED_MESSAGE = '장바구니에 담았어요.';

interface AddToCartVariables {
  request: AddCartItemRequest;
  replace: boolean;
}

/** 장바구니 담기 훅 반환값 */
export interface UseAddToCartResult {
  /** 메뉴를 담는다 (replace=false) */
  addToCart: (request: AddCartItemRequest) => void;
  /** 다른 가게 장바구니 교체를 확인 중인 요청 (없으면 null) */
  pendingReplace: AddCartItemRequest | null;
  /** 교체 확인: 비우고 담기 (replace=true) */
  confirmReplace: () => void;
  /** 교체 취소 */
  cancelReplace: () => void;
  isPending: boolean;
}

/**
 * 장바구니 담기. 409 CART_DIFFERENT_STORE면 교체 확인을 기다렸다가 replace=true로 다시 보낸다.
 * 성공하면 장바구니 쿼리를 invalidate하고, 그 밖의 에러는 서버 메시지를 토스트로 보여 준다.
 * @returns 담기 함수·교체 확인 상태
 */
export const useAddToCart = (): UseAddToCartResult => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [pendingReplace, setPendingReplace] = useState<AddCartItemRequest | null>(null);

  const mutation = useMutation({
    mutationFn: ({ request, replace }: AddToCartVariables) => addCartItem(request, replace),
    onSuccess: async (): Promise<void> => {
      setPendingReplace(null);
      toast(ADDED_MESSAGE);
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error: unknown, { request, replace }: AddToCartVariables): void => {
      if (!replace && getErrorCode(error) === CART_DIFFERENT_STORE) {
        setPendingReplace(request);
        return;
      }
      setPendingReplace(null);
      toast(getErrorMessage(error));
    },
  });

  /**
   * 메뉴를 담는다.
   * @param request - 가게·메뉴·수량
   */
  const addToCart = (request: AddCartItemRequest): void => {
    mutation.mutate({ request, replace: false });
  };

  /** 교체를 확인하고 비운 뒤 담는다. */
  const confirmReplace = (): void => {
    if (pendingReplace) mutation.mutate({ request: pendingReplace, replace: true });
  };

  /** 교체를 취소한다. */
  const cancelReplace = (): void => {
    setPendingReplace(null);
  };

  return { addToCart, pendingReplace, confirmReplace, cancelReplace, isPending: mutation.isPending };
};
