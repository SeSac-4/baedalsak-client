import type { ReactNode } from 'react';

import type { Cart } from '@/entities/cart';
import { formatPrice } from '@/shared/lib/format';
import { Card } from '@/shared/ui/card';

/** 메뉴 합계·배달비·총 결제 금액 카드. U-03·U-04에서 사용. */
export interface CartAmountCardProps {
  cart: Cart;
  title: string;
  /** 총 결제 금액 아래 내용 (최소주문 안내 등) */
  children?: ReactNode;
}

/**
 * 결제 금액 카드를 렌더링한다.
 * @param props cart(장바구니), title(카드 제목), children(금액 아래 내용)
 * @returns 결제 금액 카드 요소
 */
export function CartAmountCard({ cart, title, children }: CartAmountCardProps): ReactNode {
  return (
    <Card
      padding='none'
      className='p-5'
    >
      <h2 className='mb-2.5 font-bold text-fg'>{title}</h2>
      <dl className='grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 tabular-nums'>
        <dt className='text-fg-muted'>메뉴 합계</dt>
        <dd className='text-right text-fg'>{formatPrice(cart.itemsAmount)}</dd>
        <dt className='text-fg-muted'>배달비</dt>
        <dd className='text-right text-fg'>{formatPrice(cart.deliveryFee)}</dd>
      </dl>
      <div className='mt-3 flex items-center justify-between border-t border-border pt-3'>
        <span className='font-bold text-fg'>총 결제 금액</span>
        <span className='text-title font-bold text-fg tabular-nums'>{formatPrice(cart.totalAmount)}</span>
      </div>
      {children}
    </Card>
  );
}
