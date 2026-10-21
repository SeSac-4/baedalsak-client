import { formatPrice } from '@/shared/lib/format';

import type { Cart } from '../model/cart-types';

/**
 * 주문 불가 사유를 안내 문구로 바꾼다.
 * @param cart 장바구니
 * @returns 안내 문구 (주문 가능하거나 비어 있으면 null)
 */
export const formatCannotOrderReason = (cart: Cart): string | null => {
  if (cart.cannotOrderReason === 'MIN_ORDER_AMOUNT_NOT_MET') {
    const shortage = cart.minOrderAmount - cart.itemsAmount;
    return `최소주문금액 ${formatPrice(cart.minOrderAmount)}까지 ${formatPrice(shortage)} 더 담아 주세요.`;
  }
  if (cart.cannotOrderReason === 'STORE_CLOSED') {
    return '지금은 가게 영업시간이 아니라 주문할 수 없어요.';
  }
  return null;
};
