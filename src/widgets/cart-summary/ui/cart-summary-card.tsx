import type { ReactNode } from 'react';

import { CartItemCard, formatCannotOrderReason, type Cart } from '@/entities/cart';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { QtyStepper } from '@/shared/ui/qty-stepper';

/** CMP-12 CartPanel — 가게명·항목·합계·주문하기·주문 불가 안내. U-02(aside)·U-03에서 사용. */
export interface CartSummaryCardProps {
  cart: Cart;
  className?: string;
}

/**
 * 장바구니 요약 카드를 렌더링한다. 수량·삭제·주문하기 동작은 API 연동 시 구현한다.
 * @param props cart(장바구니)
 * @returns 장바구니 요약 요소
 */
export function CartSummaryCard({ cart, className }: CartSummaryCardProps): ReactNode {
  if (cart.items.length === 0) {
    return (
      <Card className={className}>
        <strong className='text-body text-fg'>장바구니</strong>
        <p className='py-4 text-center text-body text-fg-muted'>메뉴를 담으면 여기에 보여요.</p>
      </Card>
    );
  }

  const reason = formatCannotOrderReason(cart);

  return (
    <Card className={className}>
      <strong className='text-body text-fg'>장바구니 · {cart.storeName}</strong>

      <ul className='mt-2 divide-y divide-border'>
        {cart.items.map((item) => (
          <li key={item.menuId}>
            <CartItemCard
              item={item}
              actions={
                <>
                  <QtyStepper
                    value={item.quantity}
                    label={item.menuName}
                  />
                  <Button
                    variant='secondary'
                    size='sm'
                  >
                    삭제
                  </Button>
                </>
              }
            />
          </li>
        ))}
      </ul>

      <dl className='mt-3 flex flex-col gap-1.5 border-t border-border pt-3 text-body tabular-nums'>
        <div className='flex justify-between'>
          <dt className='text-fg-muted'>메뉴 합계</dt>
          <dd className='text-fg'>{formatPrice(cart.itemsAmount)}</dd>
        </div>
        <div className='flex justify-between'>
          <dt className='text-fg-muted'>배달비</dt>
          <dd className='text-fg'>{formatPrice(cart.deliveryFee)}</dd>
        </div>
        <div className='flex justify-between font-bold'>
          <dt className='text-fg'>합계</dt>
          <dd className='text-fg'>{formatPrice(cart.totalAmount)}</dd>
        </div>
      </dl>

      <Button
        block
        size='lg'
        disabled={!cart.canOrder}
        className='mt-3'
      >
        주문하기
      </Button>
      {reason ? <p className='mt-2 text-note text-warn'>{reason}</p> : null}
    </Card>
  );
}
