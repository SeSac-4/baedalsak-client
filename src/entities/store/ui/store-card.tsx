import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

import { formatBusinessHour } from '../lib/format-business-hour';
import type { StoreSummary } from '../model/store-types';

/** CMP-10 StoreCard — 이름·영업 배지·카테고리·최소주문·배달비·오늘 영업시간. */
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
      className={cn('flex flex-col gap-1.5', !store.isOpenNow && 'opacity-60', className)}
    >
      <div className='flex items-start justify-between gap-2'>
        <strong className='text-base text-fg'>{store.name}</strong>
        <Badge tone={store.isOpenNow ? 'ok' : 'muted'}>{store.isOpenNow ? '영업중' : '영업 종료'}</Badge>
      </div>
      <span className='text-note text-fg-muted'>
        {categoryName} · 최소주문 {formatPrice(store.minOrderAmount)} · 배달비 {formatPrice(store.deliveryFee)}
      </span>
      <span className='text-note text-fg-muted'>오늘 {formatBusinessHour(store.todayHour)}</span>
    </Card>
  );
}
