import type { ReactNode } from 'react';

import {
  DELIVERY_STATUS_LABEL,
  DELIVERY_STATUS_TONE,
  formatRemaining,
  useDeliveryLocation,
  type Delivery,
  type RiderLocation,
} from '@/entities/delivery';
import type { OrderDetail } from '@/entities/order';
import { getErrorMessage } from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import { formatTime } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

export interface DeliveryStatusCardProps {
  order: OrderDetail;
  /** 배달 정보 (배달 생성 전이면 null, 불러오는 중·실패면 undefined) */
  delivery: Delivery | null | undefined;
  /** 배달 조회 에러 (403 등) */
  deliveryError: unknown;
}

interface DeliveryCopy {
  headline: string;
  description?: string;
}

/**
 * 배달 상태별 안내 문구를 고른다. 픽업 중에는 라이더 위치로 남은 거리·시간을 보여 준다.
 * @param delivery 배달 정보 (생성 전이면 null)
 * @param order 주문 상세
 * @param location 라이더 위치 (픽업 중이 아니거나 아직 없으면 null)
 * @returns 큰 문구와 보조 문구
 */
const getDeliveryCopy = (
  delivery: Delivery | null,
  order: OrderDetail,
  location: RiderLocation | null,
): DeliveryCopy => {
  if (!delivery) return { headline: '배차 준비 중이에요', description: '조리를 계속 진행해 주세요.' };

  switch (delivery.status) {
    case 'WAITING':
      return { headline: '라이더를 찾고 있어요', description: '조리를 계속 진행해 주세요.' };
    case 'ASSIGNED':
      return {
        headline: '라이더가 가게로 오고 있어요',
        description: order.estimatedReadyAt
          ? `${formatTime(order.estimatedReadyAt)}까지 포장해 두면 바로 픽업해요.`
          : undefined,
      };
    case 'PICKED_UP':
      return {
        headline: '음식이 고객에게 가고 있어요',
        description:
          (location ? formatRemaining(location) : null) ??
          (delivery.pickedUpAt ? `${formatTime(delivery.pickedUpAt)}에 픽업했어요.` : undefined),
      };
    case 'DELIVERED':
      return {
        headline: '배달이 완료됐어요',
        description: delivery.completedAt ? `${formatTime(delivery.completedAt)}에 고객에게 전달됐어요.` : undefined,
      };
  }
};

/**
 * 배달 현황 카드 (O-03): 상태 안내(픽업 중이면 남은 거리·시간), 배정 라이더, 배차·픽업·도착 시각.
 * 지도는 픽업 후 OrderDeliveryMap 이 따로 보여 준다.
 * @param props order(주문 상세), delivery(배달 정보), deliveryError(배달 조회 에러)
 * @returns 배달 현황 카드 요소
 */
export function DeliveryStatusCard({ order, delivery, deliveryError }: DeliveryStatusCardProps): ReactNode {
  // 배달이 진행 중이면 상태·위치를 폴링한다 (픽업되면 지도가 뜨고, 완료되면 화면이 바뀐다). 지도와 같은 캐시
  const { data: tracking } = useDeliveryLocation(order.id, Boolean(delivery) && delivery?.status !== 'DELIVERED');

  if (deliveryError || delivery === undefined) {
    return (
      <Card className='flex flex-col gap-1.5'>
        <h2 className='font-bold text-fg'>배달 현황</h2>
        <p className='text-note text-fg-muted'>
          {deliveryError ? getErrorMessage(deliveryError) : '배달 정보를 불러오고 있어요.'}
        </p>
      </Card>
    );
  }

  const { headline, description } = getDeliveryCopy(delivery, order, tracking?.location ?? null);
  const timeline: { label: string; time: string | null }[] = [
    { label: '배차', time: delivery?.assignedAt ?? null },
    { label: '픽업', time: delivery?.pickedUpAt ?? null },
    { label: '도착', time: delivery?.completedAt ?? null },
  ];

  return (
    <Card className='flex flex-col gap-3.5'>
      <div className='flex items-start gap-3'>
        <div className='min-w-0 flex-1'>
          <h2 className='font-bold text-fg'>배달 현황</h2>
          <p className='mt-1.5 text-title font-bold text-fg'>{headline}</p>
          {description ? <p className='mt-0.5 text-note text-fg-muted'>{description}</p> : null}
        </div>
        {delivery ? (
          <Badge tone={DELIVERY_STATUS_TONE[delivery.status]}>{DELIVERY_STATUS_LABEL[delivery.status]}</Badge>
        ) : (
          <Badge tone='muted'>배차 준비 중</Badge>
        )}
      </div>

      {delivery?.riderName ? (
        <div className='flex items-center gap-2.5'>
          <span
            aria-hidden
            className='flex size-10 flex-none items-center justify-center rounded-full bg-role-soft font-bold text-role-ink'
          >
            {delivery.riderName.charAt(0)}
          </span>
          <div className='min-w-0 flex-1 leading-[1.35]'>
            <p className='font-semibold text-fg'>{delivery.riderName}</p>
            <p className='text-note text-fg-muted'>배정 라이더</p>
          </div>
        </div>
      ) : null}

      <ol
        aria-label='배달 진행 시각'
        className='grid grid-cols-3 gap-2 border-t border-border pt-3.5'
      >
        {timeline.map(({ label, time }) => (
          <li
            key={label}
            className='flex gap-2'
          >
            <span className={cn('mt-1.75 size-2.5 flex-none rounded-full', time ? 'bg-role' : 'bg-border-strong')} />
            <div className='leading-[1.4]'>
              <p className={cn('font-semibold', time ? 'text-fg' : 'text-fg-muted')}>{label}</p>
              <p className='text-note text-fg-muted tabular-nums'>{time ? formatTime(time) : '-'}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
