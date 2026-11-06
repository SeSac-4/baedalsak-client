import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { getCartItemCount, type Cart } from '@/entities/cart';
import { formatPrice } from '@/shared/lib/format';
import { getButtonClassName } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

export interface StoreCartSummaryProps {
  cart: Cart;
}

const CART_LINK_CLASS = getButtonClassName({ size: 'lg', block: true });

/**
 * 가게 상세의 장바구니 요약 (PC 오른쪽 카드). 메뉴를 담기 전에는 안내만 보여 준다.
 * @param props cart(내 장바구니)
 * @returns 장바구니 요약 카드 요소
 */
export function StoreCartSummary({ cart }: StoreCartSummaryProps): ReactNode {
  if (cart.items.length === 0) {
    return (
      <Card className='flex flex-col gap-3'>
        <h2 className='font-bold text-fg'>장바구니</h2>
        <p className='text-note text-fg-muted'>메뉴를 담으면 여기에 보여요.</p>
      </Card>
    );
  }

  return (
    <Card className='flex flex-col gap-3'>
      <div className='flex items-center'>
        <h2 className='flex-1 font-bold text-fg'>장바구니</h2>
        <span className='text-note text-fg-muted'>{cart.storeName}</span>
      </div>
      <div className='flex items-center justify-between border-t border-border pt-3'>
        <span className='text-fg-muted'>메뉴 {getCartItemCount(cart)}개</span>
        <span className='text-title font-bold text-fg tabular-nums'>{formatPrice(cart.itemsAmount)}</span>
      </div>
      <span className='text-note text-fg-muted'>배달비 {formatPrice(cart.deliveryFee)}은 주문서에서 더해져요.</span>
      <Link
        to='/cart'
        className={CART_LINK_CLASS}
      >
        장바구니 보기
      </Link>
    </Card>
  );
}
