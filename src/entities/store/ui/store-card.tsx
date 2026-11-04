import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Icon } from '@/shared/ui/icon';
import { Thumbnail } from '@/shared/ui/thumbnail';

import { formatBusinessHour } from '../lib/format-business-hour';
import type { StoreSummary } from '../model/store-types';

/** CMP-10 StoreCard — 가게 사진·이름·영업 배지·카테고리·최소주문·배달비·오늘 영업시간. */
export interface StoreCardProps {
  store: StoreSummary;
  categoryName: string;
  className?: string;
}

/**
 * 가게 목록 항목 카드를 렌더링한다. 영업 종료 가게는 흐리게 표시한다.
 * @param props store(가게 요약), categoryName(카테고리 표시명)
 * @returns 가게 카드 요소
 */
export function StoreCard({ store, categoryName, className }: StoreCardProps): ReactNode {
  return (
    <Card
      interactive
      padding='none'
      className={cn('flex gap-3 p-4', !store.isOpenNow && 'opacity-55', className)}
    >
      <Thumbnail
        src={store.imageUrl}
        alt={`${store.name} 가게 사진`}
        className='size-21 flex-none border border-border'
      />
      <div className='flex min-w-0 flex-1 flex-col justify-center gap-0.5 leading-[1.45]'>
        <div className='flex flex-wrap items-center gap-x-2 gap-y-0.5'>
          <strong className='min-w-0 font-bold wrap-break-word text-fg'>{store.name}</strong>
          <Badge tone={store.isOpenNow ? 'ok' : 'muted'}>{store.isOpenNow ? '영업중' : '영업 종료'}</Badge>
        </div>
        <span className='text-note text-fg-muted'>
          {categoryName} · 최소주문 {formatPrice(store.minOrderAmount)} · 배달비 {formatPrice(store.deliveryFee)}
        </span>
        <span className='flex items-center gap-1 text-note text-fg-muted'>
          <Icon
            name='clock'
            size={14}
          />
          오늘 {formatBusinessHour(store.todayHour)}
        </span>
      </div>
    </Card>
  );
}
