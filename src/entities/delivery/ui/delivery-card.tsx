import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Icon } from '@/shared/ui/icon';

import { DELIVERY_STATUS_LABEL, DELIVERY_STATUS_TONE, getReadyMinutesLeft } from '../lib/format-delivery';
import type { RiderDelivery, WaitingDelivery } from '../model/delivery-types';

/** 조리 완료까지 이 분 이하로 남으면 주황으로 강조한다 */
const READY_SOON_MINUTES = 5;

/**
 * CMP-20 DeliveryCard — 순번·배달비·조리 완료까지 남은 시간, 픽업 → 배달 경로 + 동작 버튼 슬롯.
 * 배차 대기(WaitingDelivery)는 배달지를 동 단위로, 진행 중(RiderDelivery)은 상태 배지와 전체 주소로 보여 준다.
 */
export interface DeliveryCardProps {
  delivery: WaitingDelivery | RiderDelivery;
  /** 목록 순번 (1부터). 없으면 숨김 */
  order?: number;
  /** 선택된 카드면 역할색 테두리와 순번 채움으로 강조한다 (지도 핀과 함께 고를 때) */
  selected?: boolean;
  /** 카드 본문을 누르면 호출된다. 있으면 본문이 선택 버튼이 된다 */
  onSelect?: () => void;
  /** 하단 동작 영역 (수락·픽업 완료·배달 완료 버튼 1개) */
  footer?: ReactNode;
  className?: string;
}

interface RouteStep {
  label: string;
  title: string;
  description?: string;
}

/**
 * 진행 중 배달인지 판단한다. 대기 목록 응답에는 상태가 없다.
 * @param delivery 배차 대기 또는 진행 중 배달
 * @returns 진행 중 배달이면 true
 */
const isRiderDelivery = (delivery: WaitingDelivery | RiderDelivery): delivery is RiderDelivery => 'status' in delivery;

/**
 * 픽업 → 배달 경로 단계를 만든다. 배차 전에는 배달지를 동 단위로만 보여 준다.
 * @param delivery 배차 대기 또는 진행 중 배달
 * @returns 경로 단계 2개
 */
const getRouteSteps = (delivery: WaitingDelivery | RiderDelivery): RouteStep[] => [
  { label: '픽업', title: delivery.storeName, description: delivery.pickupAddress },
  isRiderDelivery(delivery)
    ? { label: '배달', title: delivery.deliveryAddress }
    : { label: '배달', title: delivery.deliveryDong, description: '상세 주소는 수락 후 보여요' },
];

/**
 * 조리 완료까지 남은 시간 배지를 렌더링한다.
 * @param estimatedReadyAt ISO 8601 조리 완료 예상 시각
 * @returns 배지 요소
 */
const renderReadyBadge = (estimatedReadyAt: string): ReactNode => {
  const minutesLeft = getReadyMinutesLeft(estimatedReadyAt);

  return (
    <Badge tone={minutesLeft <= READY_SOON_MINUTES ? 'warn' : 'muted'}>
      <Icon
        name='clock'
        size={12}
        strokeWidth={2.2}
      />
      {minutesLeft > 0 ? `조리 완료까지 ${minutesLeft}분` : '조리 완료'}
    </Badge>
  );
};

/**
 * 배달 카드를 렌더링한다.
 * @param props delivery(배차 대기 또는 진행 중 배달), order(순번), selected(선택 여부), onSelect(본문 선택), footer(하단 동작 영역)
 * @returns 배달 카드 요소
 */
export function DeliveryCard({
  delivery,
  order,
  selected = false,
  onSelect,
  footer,
  className,
}: DeliveryCardProps): ReactNode {
  const steps = getRouteSteps(delivery);

  const body = (
    <>
      <div className='flex items-center gap-2.5'>
        {order ? (
          <span
            aria-hidden
            className={cn(
              'flex size-6.5 flex-none items-center justify-center rounded-full text-note font-bold',
              selected ? 'bg-role text-role-on' : 'bg-role-soft text-role-ink',
            )}
          >
            {order}
          </span>
        ) : null}
        <strong className='flex-1 text-title whitespace-nowrap text-fg tabular-nums'>
          {formatPrice(delivery.deliveryFee)}
        </strong>
        {isRiderDelivery(delivery) ? (
          <Badge tone={DELIVERY_STATUS_TONE[delivery.status]}>{DELIVERY_STATUS_LABEL[delivery.status]}</Badge>
        ) : (
          renderReadyBadge(delivery.estimatedReadyAt)
        )}
      </div>

      <ol className='flex flex-col'>
        {steps.map((step, index) => {
          const isFirst = index === 0;

          return (
            <li
              key={step.label}
              className='grid grid-cols-[26px_minmax(0,1fr)] gap-x-2.5'
            >
              <span
                aria-hidden
                className='flex flex-col items-center'
              >
                <span
                  className={cn(
                    'mt-1.25 size-3 rounded-full',
                    isFirst ? 'border-[2.5px] border-role bg-surface' : 'bg-role',
                  )}
                />
                {isFirst ? <span className='my-0.5 w-0.5 flex-1 bg-role-light' /> : null}
              </span>
              <div className={cn('leading-[1.45]', isFirst && 'pb-2.5')}>
                <p className='text-note text-fg-muted'>{step.label}</p>
                <p className='font-bold text-fg'>{step.title}</p>
                {step.description ? <p className='text-note text-fg-muted'>{step.description}</p> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );

  return (
    <Card
      padding='sm'
      highlighted={selected}
      className={cn('flex flex-col gap-3.5', className)}
    >
      {onSelect ? (
        <button
          type='button'
          aria-pressed={selected}
          onClick={onSelect}
          className='flex w-full cursor-pointer flex-col gap-3.5 rounded-control text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink'
        >
          {body}
        </button>
      ) : (
        body
      )}
      {footer ? <div>{footer}</div> : null}
    </Card>
  );
}
