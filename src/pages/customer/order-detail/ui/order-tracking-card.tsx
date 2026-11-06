import type { ReactNode } from 'react';

import {
  DELIVERY_STATUS_LABEL,
  DELIVERY_STATUS_TONE,
  formatEta,
  useDeliveryLocation,
  type Delivery,
  type RiderLocation,
} from '@/entities/delivery';
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABEL,
  formatOrderItems,
  isOrderInFlow,
  type OrderDetail,
  type OrderStatus,
} from '@/entities/order';
import { PAYMENT_STATUS_LABEL, PAYMENT_STATUS_TONE, type PaymentDetail } from '@/entities/payment';
import { getErrorMessage } from '@/shared/api';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { KeyValueList, type KeyValueItem } from '@/shared/ui/key-value-list';
import { Stepper, type Step } from '@/shared/ui/stepper';

/** 주문 진행 단계 + 주문 정보 + 배달 정보. 거절·취소 주문은 진행 단계와 배달 정보 대신 환불 상태. U-09 고객 주문 상세에서 사용. */
export interface OrderTrackingCardProps {
  order: OrderDetail;
  /** 배달 정보 (배달 생성 전이면 null, 불러오는 중·실패면 undefined) */
  delivery: Delivery | null | undefined;
  /** 배달 조회 에러 (403 등) */
  deliveryError?: unknown;
  /** 결제 정보 (결제가 없으면 null, 불러오는 중·실패면 undefined) */
  payment: PaymentDetail | null | undefined;
  /** 결제 조회 에러 */
  paymentError?: unknown;
}

/**
 * ISO 시각을 표시용으로 바꾼다. 없으면 '-'.
 * @param iso ISO 8601 시각
 * @returns 'MM.DD HH:mm' 또는 '-'
 */
const formatOptionalTime = (iso: string | null): string => (iso ? formatDateTime(iso) : '-');

/**
 * 단계에 보여 줄 시각을 고른다. 서버에 단계별 이력이 없어 아는 시각만 쓴다:
 * 배달중 = 픽업 시각, 배달완료 = 완료 시각(배달 API). 결제완료·조리중은 시각 없음.
 * @param status 단계
 * @param delivery 배달 정보
 * @returns ISO 시각 (모르면 null)
 */
const getStepTime = (status: OrderStatus, delivery: Delivery | null | undefined): string | null => {
  if (status === 'DELIVERING') return delivery?.pickedUpAt ?? null;
  if (status === 'DELIVERED') return delivery?.completedAt ?? null;
  return null;
};

/**
 * 스텝퍼 단계(라벨·시각)를 만든다.
 * @param delivery 배달 정보
 * @returns 단계별 라벨·시각
 */
const getOrderSteps = (delivery: Delivery | null | undefined): Step[] =>
  ORDER_STATUS_FLOW.map((status) => {
    const time = getStepTime(status, delivery);
    return { label: ORDER_STATUS_LABEL[status], time: time ? formatDateTime(time) : undefined };
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
 * 배달 정보 목록을 만든다. 픽업 중이고 라이더 위치가 있으면 도착 예상을 함께 보여 준다.
 * @param delivery 배달
 * @param location 라이더 위치 (픽업 중이 아니거나 아직 없으면 null)
 * @returns 라벨·값 목록
 */
const getDeliveryInfoItems = (delivery: Delivery, location: RiderLocation | null): KeyValueItem[] => {
  const eta = delivery.status === 'PICKED_UP' && location ? formatEta(location) : null;
  return [
    {
      label: '배달 상태',
      value: <Badge tone={DELIVERY_STATUS_TONE[delivery.status]}>{DELIVERY_STATUS_LABEL[delivery.status]}</Badge>,
    },
    ...(eta ? [{ label: '도착 예상', value: <span className='font-bold text-fg tabular-nums'>{eta}</span> }] : []),
    { label: '배정 라이더', value: delivery.riderName ?? '배차 대기 중' },
    { label: '배정', value: formatOptionalTime(delivery.assignedAt) },
    { label: '픽업', value: formatOptionalTime(delivery.pickedUpAt) },
    { label: '완료', value: formatOptionalTime(delivery.completedAt) },
  ];
};

/**
 * 배달 정보가 없을 때의 안내 문구를 고른다.
 * @param order 주문 상세
 * @returns 조리중이면 배차 준비 중, 그 전이면 수락 대기 안내
 */
const getNoDeliveryMessage = (order: OrderDetail): string =>
  order.status === 'COOKING' ? '배차 준비 중이에요.' : '가게가 주문을 수락하면 배달 요청이 만들어져요.';

/**
 * 배달 정보 대신 보여 줄 문구를 고른다.
 * @param order 주문 상세
 * @param delivery 배달 정보 (생성 전이면 null, 불러오는 중·실패면 undefined)
 * @param deliveryError 배달 조회 에러
 * @returns 실패 메시지 · 불러오는 중 안내 · 배달 없음 안내
 */
const getDeliveryPlaceholder = (
  order: OrderDetail,
  delivery: Delivery | null | undefined,
  deliveryError: unknown,
): string => {
  if (deliveryError) return getErrorMessage(deliveryError);
  if (delivery === undefined) return '배달 정보를 불러오고 있어요.';
  return getNoDeliveryMessage(order);
};

/**
 * 거절·취소 주문의 안내 문구를 고른다.
 * @param order 주문 상세
 * @returns 주문이 끝난 이유
 */
const getClosedMessage = (order: OrderDetail): string =>
  order.status === 'REJECTED' ? '가게가 주문을 거절했어요.' : '주문을 취소했어요.';

/**
 * 환불 정보 대신 보여 줄 문구를 고른다.
 * @param payment 결제 정보 (없으면 null, 불러오는 중·실패면 undefined)
 * @param paymentError 결제 조회 에러
 * @returns 실패 메시지 · 불러오는 중 안내 · 결제 없음 안내
 */
const getRefundPlaceholder = (payment: PaymentDetail | null | undefined, paymentError: unknown): string => {
  if (paymentError) return getErrorMessage(paymentError);
  if (payment === undefined) return '환불 정보를 불러오고 있어요.';
  return '결제 내역이 없어요.';
};

/**
 * 환불 정보 목록을 만든다. payment 는 명령을 받기 전까지 승인 완료이므로 그동안은 환불 준비 중으로 보여 준다.
 * @param payment 결제 정보
 * @returns 라벨·값 목록
 */
const getRefundInfoItems = (payment: PaymentDetail): KeyValueItem[] => [
  {
    label: '환불 상태',
    value:
      payment.status === 'APPROVED' ? (
        <Badge tone='warn'>환불 준비 중</Badge>
      ) : (
        <Badge tone={PAYMENT_STATUS_TONE[payment.status]}>{PAYMENT_STATUS_LABEL[payment.status]}</Badge>
      ),
  },
  {
    label: '환불 금액',
    value: <span className='tabular-nums'>{formatPrice(payment.cancelAmount ?? payment.amount)}</span>,
  },
  { label: '사유', value: payment.cancelReason ?? '-' },
  { label: '환불 완료', value: formatOptionalTime(payment.canceledAt) },
];

/**
 * 주문 추적 카드를 렌더링한다.
 * @param props order(주문 상세), delivery(배달 정보), deliveryError(배달 조회 에러), payment(결제 정보), paymentError(결제 조회 에러)
 * @returns 진행 단계·주문 정보·배달 정보 요소. 거절·취소 주문은 환불 상태·주문 정보 요소
 */
export function OrderTrackingCard({
  order,
  delivery,
  deliveryError,
  payment,
  paymentError,
}: OrderTrackingCardProps): ReactNode {
  // 배달이 진행 중이면 상태·위치를 폴링한다 (픽업되면 지도가 뜨고, 완료되면 화면이 바뀐다). 지도와 같은 캐시
  const { data: tracking } = useDeliveryLocation(order.id, Boolean(delivery) && delivery?.status !== 'DELIVERED');

  if (!isOrderInFlow(order.status)) {
    return (
      <div className='grid gap-4 tablet:grid-cols-2 tablet:items-start'>
        <Card className='flex flex-col gap-3'>
          <strong className='text-body text-fg'>{getClosedMessage(order)}</strong>
          {payment ? (
            <KeyValueList items={getRefundInfoItems(payment)} />
          ) : (
            <p className='text-body text-fg-muted'>{getRefundPlaceholder(payment, paymentError)}</p>
          )}
        </Card>

        <Card className='flex flex-col gap-3'>
          <strong className='text-body text-fg'>주문 정보</strong>
          <KeyValueList items={getOrderInfoItems(order)} />
        </Card>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <Stepper
          steps={getOrderSteps(delivery)}
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
            <KeyValueList items={getDeliveryInfoItems(delivery, tracking?.location ?? null)} />
          ) : (
            <p className='text-body text-fg-muted'>{getDeliveryPlaceholder(order, delivery, deliveryError)}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
