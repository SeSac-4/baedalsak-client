import type { ReactNode } from 'react';

import { DELIVERY_STATUS_LABEL, DELIVERY_STATUS_TONE, type Delivery } from '@/entities/delivery';
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, formatOrderItems, type OrderDetail } from '@/entities/order';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { KeyValueList, type KeyValueItem } from '@/shared/ui/key-value-list';
import { Stepper, type Step } from '@/shared/ui/stepper';

/** 주문 진행 단계 + 주문 정보 + 배달 정보. U-09 고객 주문 상세·O-03 사장님 주문 상세에서 사용. */
export interface OrderTrackingCardProps {
  order: OrderDetail;
  /** 배달 정보 (배달 API 404면 null) */
  delivery: Delivery | null;
}

/**
 * ISO 시각을 표시용으로 바꾼다. 없으면 '-'.
 * @param iso ISO 8601 시각
 * @returns 'MM.DD HH:mm' 또는 '-'
 */
const formatOptionalTime = (iso: string | null): string => (iso ? formatDateTime(iso) : '-');

/**
 * 주문 상태 이력으로 스텝퍼 단계를 만든다.
 * @param order 주문 상세
 * @returns 단계별 라벨·시각
 */
const getOrderSteps = (order: OrderDetail): Step[] =>
  ORDER_STATUS_FLOW.map((status) => {
    const history = order.statusHistory.find((item) => item.status === status);
    return { label: ORDER_STATUS_LABEL[status], time: history ? formatDateTime(history.at) : undefined };
  });

/**
 * 주문 정보 목록을 만든다.
 * @param order 주문 상세
 * @returns 라벨·값 목록
 */
const getOrderInfoItems = (order: OrderDetail): KeyValueItem[] => [
  { label: '가게', value: order.storeName },
  { label: '주문번호', value: <span className='tabular-nums'>#{order.id}</span> },
  { label: '메뉴', value: formatOrderItems(order.items) },
  { label: '배달 주소', value: order.deliveryAddress },
  { label: '가게 요청', value: order.storeRequest ?? '-' },
  { label: '라이더 요청', value: order.riderRequest ?? '-' },
  { label: '조리 완료 예상', value: formatOptionalTime(order.estimatedReadyAt) },
  {
    label: '결제 금액',
    value: (
      <span className='tabular-nums'>
        {formatPrice(order.totalAmount)}
        <span className='text-note text-fg-muted'>
          {' '}
          (메뉴 {formatPrice(order.itemsAmount)} + 배달비 {formatPrice(order.deliveryFee)})
        </span>
      </span>
    ),
  },
];

/**
 * 배달 정보 목록을 만든다.
 * @param delivery 배달
 * @returns 라벨·값 목록
 */
const getDeliveryInfoItems = (delivery: Delivery): KeyValueItem[] => [
  {
    label: '배달 상태',
    value: <Badge tone={DELIVERY_STATUS_TONE[delivery.status]}>{DELIVERY_STATUS_LABEL[delivery.status]}</Badge>,
  },
  { label: '배정 라이더', value: delivery.riderName ?? '배차 대기 중' },
  { label: '배정', value: formatOptionalTime(delivery.assignedAt) },
  { label: '픽업', value: formatOptionalTime(delivery.pickedUpAt) },
  { label: '완료', value: formatOptionalTime(delivery.completedAt) },
];

/**
 * 배달 정보가 없을 때의 안내 문구를 고른다.
 * @param order 주문 상세
 * @returns 조리중이면 배차 준비 중, 그 전이면 수락 대기 안내
 */
const getNoDeliveryMessage = (order: OrderDetail): string =>
  order.status === 'COOKING' ? '배차 준비 중이에요.' : '가게가 주문을 수락하면 배달 요청이 만들어져요.';

/**
 * 주문 추적 카드를 렌더링한다.
 * @param props order(주문 상세), delivery(배달 정보)
 * @returns 진행 단계·주문 정보·배달 정보 요소
 */
export function OrderTrackingCard({ order, delivery }: OrderTrackingCardProps): ReactNode {
  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <Stepper
          steps={getOrderSteps(order)}
          current={ORDER_STATUS_FLOW.indexOf(order.status)}
        />
      </Card>

      <div className='grid gap-4 tablet:grid-cols-2 tablet:items-start'>
        <Card className='flex flex-col gap-3'>
          <strong className='text-body text-fg'>주문 정보</strong>
          <KeyValueList items={getOrderInfoItems(order)} />
        </Card>

        <Card className='flex flex-col gap-3'>
          <strong className='text-body text-fg'>배달 정보</strong>
          {delivery ? (
            <KeyValueList items={getDeliveryInfoItems(delivery)} />
          ) : (
            <p className='text-body text-fg-muted'>{getNoDeliveryMessage(order)}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
