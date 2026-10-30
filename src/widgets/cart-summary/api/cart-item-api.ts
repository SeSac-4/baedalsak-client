import type { Cart } from '@/entities/cart';
import { apiClient } from '@/shared/api';

/**
 * 장바구니 항목 수량을 바꾼다.
 * @param menuId - 메뉴 ID
 * @param quantity - 바꿀 수량 (1 이상)
 * @returns 바뀐 장바구니
 */
export const updateCartItem = async (menuId: number, quantity: number): Promise<Cart> => {
  const { data } = await apiClient.patch<Cart>(`/cart/items/${menuId}`, { quantity });
  return data;
};

/**
 * 장바구니 항목을 삭제한다. 마지막 항목이면 빈 장바구니를 돌려준다.
 * @param menuId - 메뉴 ID
 * @returns 바뀐 장바구니
 */
export const removeCartItem = async (menuId: number): Promise<Cart> => {
  const { data } = await apiClient.delete<Cart>(`/cart/items/${menuId}`);
  return data;
};
