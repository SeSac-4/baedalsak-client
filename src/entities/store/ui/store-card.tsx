import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';
import { Card } from '@/shared/ui/card';
import { Thumbnail } from '@/shared/ui/thumbnail';

import { getStoreClosedNotice, getStoreClosingInfo } from '../lib/get-store-availability';
import { getStoreDefaultImage } from '../lib/get-store-default-image';
import type { StoreSummary } from '../model/store-types';

/** CMP-10 StoreCard — 위쪽 가게 사진(주문 불가 안내) + 이름·카테고리·마감 시간 + 배달비·최소주문 두 칸. */
export interface StoreCardProps {
  store: StoreSummary;
  categoryName: string;
  className?: string;
}

/**
 * 가게 목록 항목 카드를 렌더링한다. 주문할 수 없는 가게는 사진만 덮어 이유를 보여 주고 글자는 읽히게 둔다.
 * @param props store(가게 요약), categoryName(카테고리 표시명)
 * @returns 가게 카드 요소
 */
export function StoreCard({ store, categoryName, className }: StoreCardProps): ReactNode {
  const closedNotice = getStoreClosedNotice(store);
  const closingInfo = getStoreClosingInfo(store);
  const isFree = store.deliveryFee === 0;
  const valueColor = closedNotice ? 'text-fg-2' : 'text-fg';

  return (
    <Card
      interactive
      padding='none'
      className={cn('flex h-full flex-col', className)}
    >
      <div className='relative flex-none border-b border-border'>
        <Thumbnail
          src={store.imageUrl}
          fallbackSrc={getStoreDefaultImage(store.category)}
          alt={`${store.name} 가게 사진`}
          placeholderLabel='가게 사진'
          className='aspect-video w-full rounded-none'
        />
        {closedNotice ? (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-scrim px-4 text-center text-on-scrim'>
            <strong className='text-[1.05rem] font-bold'>{closedNotice.title}</strong>
            {closedNotice.description ? <span className='text-note opacity-90'>{closedNotice.description}</span> : null}
          </div>
        ) : null}
      </div>
      <div className='flex min-w-0 flex-1 flex-col gap-3 px-4 pt-3.5 pb-4'>
        <div className='min-w-0'>
          <strong
            className={cn(
              'block text-[1.0625rem] leading-[1.35] font-bold tracking-[-0.01em] wrap-break-word',
              valueColor,
            )}
          >
            {store.name}
          </strong>
          <div className='mt-[3px] flex flex-wrap items-center gap-1.5 text-note text-fg-2'>
            {categoryName ? <span>{categoryName}</span> : null}
            {categoryName && closingInfo ? (
              <span
                aria-hidden='true'
                className='size-[3px] rounded-full bg-fg-muted'
              />
            ) : null}
            {closingInfo?.isClosingSoon ? (
              <span className='font-semibold text-warn'>{closingInfo.closeTime} 곧 마감</span>
            ) : null}
            {closingInfo && !closingInfo.isClosingSoon ? <span>{closingInfo.closeTime}까지</span> : null}
          </div>
        </div>
        <dl className='mt-auto grid grid-cols-2 border-t border-border pt-3'>
          <div>
            <dt className='text-note text-fg-muted'>배달비</dt>
            <dd
              className={cn(
                'mt-px text-[0.96875rem] font-bold tabular-nums',
                isFree && !closedNotice ? 'text-role-ink' : valueColor,
              )}
            >
              {isFree ? '무료' : formatPrice(store.deliveryFee)}
            </dd>
          </div>
          <div className='border-l border-border pl-3.5'>
            <dt className='text-note text-fg-muted'>최소주문</dt>
            <dd className={cn('mt-px text-[0.96875rem] font-bold tabular-nums', valueColor)}>
              {formatPrice(store.minOrderAmount)}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
