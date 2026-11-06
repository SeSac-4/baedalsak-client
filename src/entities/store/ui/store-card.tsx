import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Icon } from '@/shared/ui/icon';
import { Thumbnail } from '@/shared/ui/thumbnail';

import { formatBusinessHour } from '../lib/format-business-hour';
import { getStoreDefaultImage } from '../lib/get-store-default-image';
import type { StoreSummary } from '../model/store-types';

/** CMP-10 StoreCard — 위쪽 가게 사진 + 이름·영업 배지·카테고리·최소주문·배달비·오늘 영업시간. */
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
      className={cn('flex h-full flex-col', !store.isOpenNow && 'opacity-55', className)}
    >
      <Thumbnail
        src={store.imageUrl}
        fallbackSrc={getStoreDefaultImage(store.category)}
        alt={`${store.name} 가게 사진`}
        placeholderLabel='가게 사진'
        className='aspect-video w-full flex-none rounded-none border-b border-border'
      />
      <div className='flex min-w-0 flex-1 flex-col gap-1 p-4 leading-[1.45]'>
        <div className='flex items-start justify-between gap-2'>
          <strong className='min-w-0 text-[1rem] font-bold wrap-break-word text-fg'>{store.name}</strong>
          <Badge
            tone={store.isOpenNow ? 'ok' : 'muted'}
            className='flex-none'
          >
            {store.isOpenNow ? '영업중' : '영업 종료'}
          </Badge>
        </div>
        <span className='text-fg-muted'>
          {categoryName} · 배달비 {formatPrice(store.deliveryFee)}
        </span>
        <span className='text-fg-muted'>최소주문 {formatPrice(store.minOrderAmount)}</span>
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
