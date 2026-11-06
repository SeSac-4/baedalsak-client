import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';

import type { CartItem } from '../model/cart-types';

/** CMP-11 장바구니 항목 — 메뉴명·단가·항목 금액 + 삭제·수량 슬롯. */
export interface CartItemCardProps {
  item: CartItem;
  /** 메뉴명 오른쪽 동작 (삭제) */
  removeAction?: ReactNode;
  /** 항목 금액 왼쪽 동작 (수량 조절) */
  quantityAction?: ReactNode;
  className?: string;
}

/**
 * 장바구니 항목의 메뉴명·단가와 항목 금액(단가×수량)을 렌더링한다.
 * @param props item(장바구니 항목), removeAction(삭제), quantityAction(수량 조절)
 * @returns 장바구니 항목 요소
 */
export function CartItemCard({ item, removeAction, quantityAction, className }: CartItemCardProps): ReactNode {
  return (
    <div className={cn('flex flex-col gap-2.5 py-3.5', className)}>
      <div className='flex items-start gap-2'>
        <div className='min-w-0 flex-1 leading-[1.45]'>
          <p className='font-bold wrap-break-word text-fg'>{item.menuName}</p>
          <p className='text-note text-fg-muted tabular-nums'>{formatPrice(item.price)}</p>
        </div>
        {removeAction}
      </div>
      <div className='flex items-center justify-between gap-3'>
        {quantityAction}
        <span className='ml-auto font-bold text-fg tabular-nums'>{formatPrice(item.price * item.quantity)}</span>
      </div>
    </div>
  );
}
