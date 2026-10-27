import type { Cart } from '@/entities/cart';
import { apiClient } from '@/shared/api';

/** 장바구니 담기 요청 */
export interface AddCartItemRequest {
  storeId: number;
  menuId: number;
  quantity: number;
}

/**
 * 장바구니에 메뉴를 담는다. 같은 메뉴는 서버가 수량을 합친다.
 * 다른 가게 메뉴가 담겨 있으면 409 CART_DIFFERENT_STORE, replace=true면 비우고 담는다.
 * @param request - 가게·메뉴·수량
 * @param replace - 다른 가게 장바구니를 비우고 담을지
 * @returns 담은 뒤 장바구니
 */
export const addCartItem = async (request: AddCartItemRequest, replace: boolean): Promise<Cart> => {
  const { data } = await apiClient.post<Cart>('/cart/items', request, { params: { replace } });
  return data;
};
