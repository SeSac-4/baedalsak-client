import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';

import type { CartItem } from '../model/cart-types';

/** CMP-11 장바구니 항목 한 줄 — 메뉴명·금액 + 우측 동작 슬롯(수량·삭제). */
export interface CartItemCardProps {
  item: CartItem;
  actions?: ReactNode;
  className?: string;
}

/**
 * 장바구니 항목의 메뉴명과 항목 금액(단가×수량)을 렌더링한다.
 * @param props item(장바구니 항목), actions(우측 동작 영역)
 * @returns 장바구니 항목 요소
 */
export function CartItemCard({ item, actions, className }: CartItemCardProps): ReactNode {
  return (
    <div className={cn('flex items-center justify-between gap-3 py-2', className)}>
      <div className='min-w-0'>
        <strong className='block truncate text-body text-fg'>{item.menuName}</strong>
        <span className='text-note text-fg-muted tabular-nums'>{formatPrice(item.price * item.quantity)}</span>
      </div>
      {actions ? <div className='flex shrink-0 items-center gap-2'>{actions}</div> : null}
    </div>
  );
}
