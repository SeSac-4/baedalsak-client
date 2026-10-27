import { apiClient } from '@/shared/api';

import type { Cart } from '../model/cart-types';

/**
 * 내 장바구니를 조회한다. 비어 있어도 200 (cannotOrderReason: CART_EMPTY).
 * @returns 장바구니
 */
export const getCart = async (): Promise<Cart> => {
  const { data } = await apiClient.get<Cart>('/cart');
  return data;
};
