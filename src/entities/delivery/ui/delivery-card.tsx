import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { KeyValueList, type KeyValueItem } from '@/shared/ui/key-value-list';

import { DELIVERY_STATUS_LABEL, DELIVERY_STATUS_TONE } from '../lib/format-delivery';
import type { RiderDelivery, WaitingDelivery } from '../model/delivery-types';

/**
 * CMP-20 DeliveryCard — 가게명·배달비·픽업지/배달지·조리 완료 예상 + 동작 버튼 슬롯.
 * 배차 대기(WaitingDelivery)는 배달지를 동 단위로, 진행 중(RiderDelivery)은 상태 배지와 전체 주소로 보여 준다.
 */
export interface DeliveryCardProps {
  delivery: WaitingDelivery | RiderDelivery;
  /** 하단 동작 영역 (수락·픽업 완료·배달 완료 버튼 1개) */
  footer?: ReactNode;
  className?: string;
}

/**
 * 진행 중 배달인지 판단한다. 대기 목록 응답에는 상태가 없다.
 * @param delivery 배차 대기 또는 진행 중 배달
 * @returns 진행 중 배달이면 true
 */
const isRiderDelivery = (delivery: WaitingDelivery | RiderDelivery): delivery is RiderDelivery => 'status' in delivery;

/**
 * 카드 본문의 라벨·값 목록을 만든다.
 * @param delivery 배차 대기 또는 진행 중 배달
 * @returns 라벨·값 목록
 */
const getDeliveryCardItems = (delivery: WaitingDelivery | RiderDelivery): KeyValueItem[] => [
  { label: '픽업', value: delivery.pickupAddress },
  { label: '배달지', value: isRiderDelivery(delivery) ? delivery.deliveryAddress : delivery.deliveryDong },
  {
    label: '조리 완료 예상',
    value: <span className='tabular-nums'>{formatDateTime(delivery.estimatedReadyAt)}</span>,
  },
];

/**
 * 배달 카드를 렌더링한다.
 * @param props delivery(배차 대기 또는 진행 중 배달), footer(하단 동작 영역)
 * @returns 배달 카드 요소
 */
export function DeliveryCard({ delivery, footer, className }: DeliveryCardProps): ReactNode {
  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <div className='flex items-start justify-between gap-2'>
        <strong className='text-base text-fg'>{delivery.storeName}</strong>
        {isRiderDelivery(delivery) ? (
          <Badge tone={DELIVERY_STATUS_TONE[delivery.status]}>{DELIVERY_STATUS_LABEL[delivery.status]}</Badge>
        ) : (
          <strong className='text-base text-fg tabular-nums'>{formatPrice(delivery.deliveryFee)}</strong>
        )}
      </div>
      <KeyValueList items={getDeliveryCardItems(delivery)} />
      {footer ? <div>{footer}</div> : null}
    </Card>
  );
}
