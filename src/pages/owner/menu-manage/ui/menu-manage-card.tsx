import type { ReactNode } from 'react';

import { SALE_STATUS_LABEL, SALE_STATUS_TONE, type Menu } from '@/entities/menu';
import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Switch } from '@/shared/ui/switch';
import { Thumbnail } from '@/shared/ui/thumbnail';

import { useToggleSaleStatus } from '../model/use-toggle-sale-status';

export interface MenuManageCardProps {
  storeId: number;
  menu: Menu;
  onEditClick: (menu: Menu) => void;
  onRemoveClick: (menu: Menu) => void;
}

const SOLD_OUT_MESSAGE = '품절 · 고객 화면에서 담을 수 없어요';

/**
 * 메뉴 목록 한 칸: 사진·이름·판매 상태·설명·가격과 판매 스위치·수정·삭제. 품절이면 메뉴 정보를 흐리게 보여 준다.
 * @param props storeId(가게 ID), menu(메뉴), onEditClick(수정), onRemoveClick(삭제)
 * @returns 메뉴 목록 항목 요소
 */
export function MenuManageCard({ storeId, menu, onEditClick, onRemoveClick }: MenuManageCardProps): ReactNode {
  const { mutate: toggleSaleStatus, isPending } = useToggleSaleStatus(storeId);
  const isOnSale = menu.saleStatus === 'ON_SALE';

  return (
    <li className='flex flex-col gap-2.5 border-t border-border py-4 first:border-t-0'>
      <div className={cn('flex items-start gap-3', !isOnSale && 'opacity-55')}>
        <Thumbnail
          src={menu.imageUrl}
          alt={`${menu.name} 사진`}
          className='size-16 flex-none border border-border'
        />
        <div className='min-w-0 flex-1 leading-[1.45]'>
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='font-bold text-fg'>{menu.name}</span>
            <Badge tone={SALE_STATUS_TONE[menu.saleStatus]}>{SALE_STATUS_LABEL[menu.saleStatus]}</Badge>
          </div>
          {menu.description ? <p className='text-note wrap-break-word text-fg-muted'>{menu.description}</p> : null}
          <p className='mt-0.5 font-bold text-fg'>{formatPrice(menu.price)}</p>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <label className='flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-control bg-canvas pl-3'>
          <span className={cn('flex-1 text-note leading-[1.3] font-semibold', isOnSale ? 'text-ok' : 'text-fg-muted')}>
            {isOnSale ? SALE_STATUS_LABEL.ON_SALE : SOLD_OUT_MESSAGE}
          </span>
          <Switch
            checked={isOnSale}
            label={`${menu.name} 판매 중`}
            disabled={isPending}
            onCheckedChange={() => toggleSaleStatus(menu)}
          />
        </label>
        <Button
          variant='secondary'
          aria-label={`${menu.name} 수정`}
          onClick={() => onEditClick(menu)}
          className='px-3.5'
        >
          수정
        </Button>
        <Button
          variant='danger-secondary'
          aria-label={`${menu.name} 삭제`}
          onClick={() => onRemoveClick(menu)}
          className='px-3.5'
        >
          삭제
        </Button>
      </div>
    </li>
  );
}
