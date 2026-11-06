import type { ReactNode } from 'react';

import type { Cart } from '@/entities/cart';
import { formatPrice } from '@/shared/lib/format';

import { CartOrderButton } from './cart-order-button';

export interface CartOrderBarProps {
  cart: Cart;
  /** 가게가 지금 영업 중인지 */
  isStoreOpen: boolean;
}

/**
 * 장바구니 아래 고정 주문 줄 (태블릿·모바일).
 * @param props cart(장바구니), isStoreOpen(가게 영업 여부)
 * @returns 주문 줄 요소
 */
export function CartOrderBar({ cart, isStoreOpen }: CartOrderBarProps): ReactNode {
  return (
    <div className='sticky bottom-0 z-10 flex items-center gap-3.5 border-t border-border bg-surface px-4 pt-3 pb-6 tablet:px-[calc(50%-356px)] desktop:hidden'>
      <div className='flex flex-none flex-col leading-[1.3]'>
        <span className='text-note text-fg-muted'>총 결제 금액</span>
        <span className='text-title font-bold text-fg tabular-nums'>{formatPrice(cart.totalAmount)}</span>
      </div>
      <CartOrderButton
        cart={cart}
        isStoreOpen={isStoreOpen}
      />
    </div>
  );
}
