import type { Cart } from '../model/cart-types';

/**
 * 담긴 메뉴 개수를 구한다.
 * @param cart - 장바구니
 * @returns 메뉴 수량 합
 */
export const getCartItemCount = (cart: Cart): number => cart.items.reduce((sum, item) => sum + item.quantity, 0);
