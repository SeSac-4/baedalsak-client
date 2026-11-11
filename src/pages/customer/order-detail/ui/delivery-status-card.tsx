import type { ReactNode } from 'react';

import {
  DELIVERY_STATUS_LABEL,
  DELIVERY_STATUS_TONE,
  formatEta,
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
import { Icon } from '@/shared/ui/icon';

import { OrderDeliveryMap } from './order-delivery-map';

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
 * 배달 상태별 안내 문구를 고른다. 픽업 중에는 라이더 위치로 도착 예상 시각·남은 거리를 보여 준다.
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
  if (!delivery) {
    return { headline: '배차 준비 중이에요', description: '가게에서 조리를 시작했어요 · 잠시 후 새로고침해 주세요' };
  }

  switch (delivery.status) {
    case 'WAITING':
      return {
        headline: '라이더를 찾고 있어요',
        description: order.estimatedReadyAt
          ? `가게에서 조리하고 있어요 · 조리 완료 예상 ${formatTime(order.estimatedReadyAt)}`
          : '가게에서 조리하고 있어요',
      };
    case 'ASSIGNED':
      return { headline: '라이더가 가게로 가고 있어요', description: '음식을 픽업하면 라이더 위치가 보여요' };
    case 'PICKED_UP':
      return {
        headline: '라이더가 배달지로 오고 있어요',
        description:
          (location ? formatEta(location) : null) ??
          (delivery.pickedUpAt ? `${formatTime(delivery.pickedUpAt)}에 픽업했어요` : undefined),
      };
    case 'DELIVERED':
      return {
        headline: '배달이 완료됐어요',
        description: delivery.completedAt
          ? `${formatTime(delivery.completedAt)}에 도착했어요. 맛있게 드세요.`
          : '맛있게 드세요.',
      };
  }
};

/**
 * 지도 대신 보여 줄 안내 문구를 고른다 (라이더 배정 전).
 * @param delivery 배달 정보 (생성 전이면 null)
 * @returns 안내 문구
 */
const getMapPlaceholder = (delivery: Delivery | null): string =>
  delivery ? '라이더가 배정되면 지도가 표시돼요' : '배차 준비 중이에요. 잠시 후 새로고침해 주세요';

/**
 * 고객 배달 현황 카드 (U-09): 상태 안내(픽업 중이면 도착 예상), 지도(배정 후), 배정 라이더, 배차·픽업·도착 시각.
 * @param props order(주문 상세), delivery(배달 정보), deliveryError(배달 조회 에러)
 * @returns 배달 현황 카드 요소
 */
export function DeliveryStatusCard({ order, delivery, deliveryError }: DeliveryStatusCardProps): ReactNode {
  // 배달이 진행 중이면 상태·위치를 폴링한다 (픽업되면 경로가 뜨고, 완료되면 화면이 바뀐다). 지도와 같은 캐시
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
  const hasRider = Boolean(delivery && delivery.status !== 'WAITING');
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
          {description ? <p className='mt-0.5 text-note text-fg-muted tabular-nums'>{description}</p> : null}
        </div>
        {delivery ? (
          <Badge tone={DELIVERY_STATUS_TONE[delivery.status]}>{DELIVERY_STATUS_LABEL[delivery.status]}</Badge>
        ) : (
          <Badge tone='muted'>배차 준비 중</Badge>
        )}
      </div>

      {delivery && hasRider ? (
        <OrderDeliveryMap
          order={order}
          delivery={delivery}
        />
      ) : (
        <div className='flex h-35 flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-track px-4 text-center text-note text-fg-muted'>
          <Icon
            name='location'
            size={22}
          />
          <span>{getMapPlaceholder(delivery)}</span>
        </div>
      )}

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
