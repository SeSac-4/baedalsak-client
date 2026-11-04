import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Thumbnail } from '@/shared/ui/thumbnail';

import type { Menu } from '../model/menu-types';

/** CMP-11 MenuItem — 메뉴 사진·메뉴명·설명·가격 + 우측 동작 슬롯(담기 등). 품절이면 흐리게. */
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
  const isSoldOut = menu.saleStatus === 'SOLD_OUT';

  return (
    <div className={cn('flex items-center gap-3 py-3.5', className)}>
      <Thumbnail
        src={menu.imageUrl}
        alt={`${menu.name} 사진`}
        placeholderLabel='메뉴 사진'
        className={cn('size-20 flex-none border border-border', isSoldOut && 'opacity-55')}
      />
      <div className={cn('flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.45]', isSoldOut && 'opacity-55')}>
        <div className='flex flex-wrap items-center gap-1.5'>
          <span className='font-bold text-fg'>{menu.name}</span>
          {isSoldOut ? <Badge tone='muted'>품절</Badge> : null}
        </div>
        {menu.description ? <p className='text-note wrap-break-word text-fg-muted'>{menu.description}</p> : null}
        <span className='font-bold text-fg tabular-nums'>{formatPrice(menu.price)}</span>
      </div>
      {action ? <div className='flex flex-none flex-col items-end gap-1'>{action}</div> : null}
    </div>
  );
}
