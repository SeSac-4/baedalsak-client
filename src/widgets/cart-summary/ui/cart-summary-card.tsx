import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { CartItemCard, type Cart, type CartItem } from '@/entities/cart';
import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';
import { Card } from '@/shared/ui/card';
import { IconButton } from '@/shared/ui/icon-button';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { QtyStepper } from '@/shared/ui/qty-stepper';

import { useRemoveCartItem } from '../model/use-remove-cart-item';
import { useUpdateCartItem } from '../model/use-update-cart-item';
import { CartAmountCard } from './cart-amount-card';
import { CartOrderButton } from './cart-order-button';

/** CMP-12 CartPanel — 가게명·항목·결제 예상 금액·최소주문 안내·주문하기. U-03에서 사용. */
export interface CartSummaryCardProps {
  cart: Cart;
  /** 가게가 지금 영업 중인지 (기본 true) */
  isStoreOpen?: boolean;
  className?: string;
}

/**
 * 장바구니 내용과 결제 예상 금액을 렌더링한다 (PC 2단). 수량 ±·삭제는 바로 서버에 반영하고, 주문하기는 주문서로 이동한다.
 * 수량이 1이면 −는 막고 삭제로 지운다. 요청 중인 항목은 버튼을 잠시 막는다.
 * @param props cart(장바구니), isStoreOpen(가게 영업 여부)
 * @returns 장바구니 요약 요소
 */
export function CartSummaryCard({ cart, isStoreOpen = true, className }: CartSummaryCardProps): ReactNode {
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

  const shortage = Math.max(0, cart.minOrderAmount - cart.itemsAmount);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 tablet:gap-3.5 desktop:grid desktop:grid-cols-[minmax(0,1fr)_340px] desktop:items-start desktop:gap-6',
        className,
      )}
    >
      <Card
        padding='none'
        className='px-5 py-1'
      >
        <div className='flex items-center gap-2 pt-3 pb-1'>
          <h2 className='min-w-0 flex-1 font-bold wrap-break-word text-fg'>{cart.storeName}</h2>
          <Link
            to={`/stores/${cart.storeId}`}
            className='inline-flex min-h-11 flex-none items-center text-note font-semibold text-role-ink hover:underline'
          >
            + 메뉴 더 담기
          </Link>
        </div>
        <ul className='divide-y divide-border border-t border-border'>
          {cart.items.map((item) => (
            <li key={item.menuId}>
              <CartItemCard
                item={item}
                removeAction={
                  <IconButton
                    icon='close'
                    label={`${item.menuName} 빼기`}
                    variant='ghost'
                    disabled={isItemPending(item)}
                    className='-mt-2.5 -mr-3 flex-none'
                    onClick={() => removeCartItem(item.menuId)}
                  />
                }
                quantityAction={
                  <QtyStepper
                    value={item.quantity}
                    label={item.menuName}
                    disabled={isItemPending(item)}
                    onDecrease={() => updateCartItem({ menuId: item.menuId, quantity: item.quantity - 1 })}
                    onIncrease={() => updateCartItem({ menuId: item.menuId, quantity: item.quantity + 1 })}
                  />
                }
              />
            </li>
          ))}
        </ul>
      </Card>

      <div className='flex flex-col gap-3 tablet:gap-3.5 desktop:sticky desktop:top-30 desktop:gap-4'>
        <CartAmountCard
          cart={cart}
          title='결제 예상 금액'
        >
          <div className='mt-3 flex flex-col gap-1.5'>
            <div className={cn('flex justify-between gap-2 text-note', shortage > 0 ? 'text-warn' : 'text-ok')}>
              <span>
                {shortage > 0 ? `${formatPrice(shortage)} 더 담으면 주문할 수 있어요` : '최소주문금액을 채웠어요'}
              </span>
              <span className='flex-none'>최소주문 {formatPrice(cart.minOrderAmount)}</span>
            </div>
            <ProgressBar
              value={cart.itemsAmount}
              max={cart.minOrderAmount}
              label='최소주문금액 채움'
              tone={shortage > 0 ? 'warn' : 'role'}
            />
          </div>
        </CartAmountCard>
        <CartOrderButton
          cart={cart}
          isStoreOpen={isStoreOpen}
          className='hidden desktop:inline-flex'
        />
      </div>
    </div>
  );
}
