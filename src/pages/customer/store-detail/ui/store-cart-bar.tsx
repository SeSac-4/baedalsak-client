import type { ReactNode } from 'react';
import { Link } from 'react-router';

import type { Cart } from '@/entities/cart';
import { formatPrice } from '@/shared/lib/format';
import { getButtonClassName } from '@/shared/ui/button';

import { getCartItemCount } from '../lib/get-cart-item-count';

export interface StoreCartBarProps {
  cart: Cart;
}

const CART_LINK_CLASS = getButtonClassName({ size: 'lg', block: true });

/**
 * 가게 상세의 아래 고정 장바구니 줄 (태블릿·모바일). 담긴 메뉴가 없으면 그리지 않는다.
 * @param props cart(내 장바구니)
 * @returns 장바구니 줄 요소
 */
export function StoreCartBar({ cart }: StoreCartBarProps): ReactNode {
  if (cart.items.length === 0) return null;

  return (
    <div className='sticky bottom-0 z-10 flex items-center gap-3.5 border-t border-border bg-surface px-4 pt-3 pb-6 tablet:px-[calc(50%-356px)] desktop:hidden'>
      <div className='flex flex-none flex-col leading-[1.3]'>
        <span className='text-note text-fg-muted'>장바구니 {getCartItemCount(cart)}개</span>
        <span className='text-title font-bold text-fg tabular-nums'>{formatPrice(cart.itemsAmount)}</span>
      </div>
      <Link
        to='/cart'
        className={CART_LINK_CLASS}
      >
        장바구니 보기
      </Link>
    </div>
  );
}
