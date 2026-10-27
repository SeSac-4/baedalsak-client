import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';

import type { Menu } from '../model/menu-types';

/** CMP-11 MenuItem — 메뉴명·설명·가격 + 우측 동작 슬롯(담기 등). 품절이면 흐리게. */
export interface MenuCardProps {
  menu: Menu;
  action?: ReactNode;
  className?: string;
}

/**
 * 메뉴 한 줄을 렌더링한다.
 * @param props menu(메뉴), action(우측 동작 영역)
 * @returns 메뉴 행 요소
 */
export function MenuCard({ menu, action, className }: MenuCardProps): ReactNode {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 py-3',
        menu.saleStatus === 'SOLD_OUT' && 'opacity-60',
        className,
      )}
    >
      <div className='min-w-0'>
        <strong className='block text-body text-fg'>{menu.name}</strong>
        {menu.description ? <p className='text-note text-fg-muted'>{menu.description}</p> : null}
        <span className='text-body text-fg tabular-nums'>{formatPrice(menu.price)}</span>
      </div>
      {action ? <div className='shrink-0'>{action}</div> : null}
    </div>
  );
}
