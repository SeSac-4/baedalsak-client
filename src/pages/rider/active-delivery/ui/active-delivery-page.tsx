import type { ReactNode } from 'react';
import { Link } from 'react-router';

import {
  DELIVERY_STATUS_LABEL,
  DELIVERY_STATUS_TONE,
  useActiveDelivery,
  type RiderDelivery,
} from '@/entities/delivery';
import { getErrorMessage } from '@/shared/api';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { KeyValueList, type KeyValueItem } from '@/shared/ui/key-value-list';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

import { useCompleteDelivery } from '../model/use-complete-delivery';
import { usePickupDelivery } from '../model/use-pickup-delivery';

const WAITING_LIST_PATH = '/rider';
const LINK_CLASS = 'text-note font-medium text-role hover:underline';

/**
 * 전화번호를 tel: 링크 주소로 바꾼다. 숫자와 +만 남긴다.
 * @param phone 전화번호 (예: 010-1234-5678)
 * @returns tel: 링크 (예: tel:01012345678)
 */
const getTelHref = (phone: string): string => `tel:${phone.replace(/[^0-9+]/g, '')}`;

/**
 * 진행 중 배달 정보 목록을 만든다.
 * @param delivery 진행 중 배달
 * @returns 라벨·값 목록
 */
const getActiveDeliveryItems = (delivery: RiderDelivery): KeyValueItem[] => [
  { label: '픽업지', value: `${delivery.storeName} · ${delivery.pickupAddress}` },
  { label: '배달 주소', value: delivery.deliveryAddress },
  {
    label: '고객 연락처',
    value: delivery.customerPhone ? (
      <a
        href={getTelHref(delivery.customerPhone)}
        className='font-medium text-role tabular-nums hover:underline'
      >
        {delivery.customerPhone}
      </a>
    ) : (
      '-'
    ),
  },
  { label: '라이더 요청', value: delivery.riderRequest ?? '-' },
  {
    label: '조리 완료 예상',
    value: <span className='tabular-nums'>{formatDateTime(delivery.estimatedReadyAt)}</span>,
  },
  { label: '주문번호', value: <span className='tabular-nums'>#{delivery.orderId}</span> },
  { label: '배달비', value: <span className='tabular-nums'>{formatPrice(delivery.deliveryFee)}</span> },
];

/**
 * R-02 진행 중 배달 화면. 맡은 배달의 픽업지·배달지·고객 연락처·요청사항을 보여 주고,
 * 상태에 따라 픽업 완료 또는 배달 완료 버튼 하나만 보여 준다. 상태 갱신은 새로고침 버튼으로만 한다.
 * @returns 진행 중 배달 페이지
 */
export function ActiveDeliveryPage(): ReactNode {
  const { data: delivery, error, isPending, isFetching, refetch } = useActiveDelivery();
  const { mutate: pickup, isPending: isPickingUp } = usePickupDelivery();
  const { mutate: complete, isPending: isCompleting } = useCompleteDelivery();
  const isSubmitting = isPickingUp || isCompleting;

  return (
    <div className='mx-auto flex max-w-[640px] flex-col px-4 py-6'>
      <PageHeader
        title='진행 중 배달'
        actions={
          <Button
            variant='secondary'
            size='sm'
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            새로고침
          </Button>
        }
      />

      {isPending ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='진행 중 배달 불러오는 중' />
          진행 중 배달을 불러오고 있어요.
        </div>
      ) : null}

      {error ? <EmptyState message={getErrorMessage(error)} /> : null}

      {delivery === null ? (
        <EmptyState
          message='진행 중인 배달이 없어요.'
          action={
            <Link
              to={WAITING_LIST_PATH}
              className={LINK_CLASS}
            >
              배차 대기 목록으로
            </Link>
          }
        />
      ) : null}

      {delivery ? (
        <Card className='flex flex-col gap-4'>
          <div className='flex items-start justify-between gap-2'>
            <strong className='text-base text-fg'>{delivery.storeName}</strong>
            <Badge tone={DELIVERY_STATUS_TONE[delivery.status]}>{DELIVERY_STATUS_LABEL[delivery.status]}</Badge>
          </div>

          <KeyValueList items={getActiveDeliveryItems(delivery)} />

          {delivery.status === 'ASSIGNED' ? (
            <Button
              block
              size='lg'
              disabled={isSubmitting}
              onClick={() => pickup(delivery.deliveryId)}
            >
              {isPickingUp ? '처리 중…' : '픽업 완료'}
            </Button>
          ) : null}

          {delivery.status === 'PICKED_UP' ? (
            <Button
              block
              size='lg'
              disabled={isSubmitting}
              onClick={() => complete(delivery.deliveryId)}
            >
              {isCompleting ? '처리 중…' : '배달 완료'}
            </Button>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
