import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { CartItemCard, formatCannotOrderReason, type Cart, type CartItem } from '@/entities/cart';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { QtyStepper } from '@/shared/ui/qty-stepper';

import { useRemoveCartItem } from '../model/use-remove-cart-item';
import { useUpdateCartItem } from '../model/use-update-cart-item';

const CHECKOUT_PATH = '/checkout';

/** CMP-12 CartPanel — 가게명·항목·합계·주문하기·주문 불가 안내. U-02(aside)·U-03에서 사용. */
export interface CartSummaryCardProps {
  cart: Cart;
  className?: string;
}

/**
 * 장바구니 요약 카드를 렌더링한다. 수량 ±·삭제는 바로 서버에 반영하고, 주문하기는 주문서로 이동한다.
 * 수량이 1이면 −는 막고 삭제로 지운다. 요청 중인 항목은 버튼을 잠시 막는다.
 * @param props cart(장바구니)
 * @returns 장바구니 요약 요소
 */
export function CartSummaryCard({ cart, className }: CartSummaryCardProps): ReactNode {
  const navigate = useNavigate();
  const { mutate: updateCartItem, isPending: isUpdating, variables: updating } = useUpdateCartItem();
  const { mutate: removeCartItem, isPending: isRemoving, variables: removingMenuId } = useRemoveCartItem();

  /**
   * 이 항목에 보낸 요청이 아직 진행 중인지 확인한다.
   * @param item - 장바구니 항목
   * @returns 요청 중 여부
   */
  const isItemPending = (item: CartItem): boolean =>
    (isUpdating && updating?.menuId === item.menuId) || (isRemoving && removingMenuId === item.menuId);

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
                    disabled={isItemPending(item)}
                    onDecrease={() => updateCartItem({ menuId: item.menuId, quantity: item.quantity - 1 })}
                    onIncrease={() => updateCartItem({ menuId: item.menuId, quantity: item.quantity + 1 })}
                  />
                  <Button
                    variant='secondary'
                    size='sm'
                    disabled={isItemPending(item)}
                    onClick={() => removeCartItem(item.menuId)}
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
        onClick={() => navigate(CHECKOUT_PATH)}
      >
        주문하기
      </Button>
      {reason ? <p className='mt-2 text-note text-warn'>{reason}</p> : null}
    </Card>
  );
}
