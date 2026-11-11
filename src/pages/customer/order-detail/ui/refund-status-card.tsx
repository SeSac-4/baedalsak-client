import type { ReactNode } from 'react';

import type { OrderDetail } from '@/entities/order';
import { PAYMENT_STATUS_LABEL, PAYMENT_STATUS_TONE, type PaymentDetail } from '@/entities/payment';
import { getErrorMessage } from '@/shared/api';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { KeyValueList, type KeyValueItem } from '@/shared/ui/key-value-list';

export interface RefundStatusCardProps {
  order: OrderDetail;
  /** 결제 정보 (결제가 없으면 null, 불러오는 중·실패면 undefined) */
  payment: PaymentDetail | null | undefined;
  /** 결제 조회 에러 */
  paymentError: unknown;
}

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
  { label: '환불 완료', value: payment.canceledAt ? formatDateTime(payment.canceledAt) : '-' },
];

/**
 * 거절·취소 주문의 환불 현황 카드 (U-09). 주문이 끝난 이유와 환불 상태·금액·사유·완료 시각을 보여 준다.
 * @param props order(주문 상세), payment(결제 정보), paymentError(결제 조회 에러)
 * @returns 환불 현황 카드 요소
 */
export function RefundStatusCard({ order, payment, paymentError }: RefundStatusCardProps): ReactNode {
  return (
    <Card className='flex flex-col gap-3.5'>
      <div>
        <h2 className='font-bold text-fg'>환불 현황</h2>
        <p className='mt-1.5 text-title font-bold text-fg'>
          {order.status === 'REJECTED' ? '가게가 주문을 거절했어요' : '주문을 취소했어요'}
        </p>
      </div>
      {payment ? (
        <KeyValueList items={getRefundInfoItems(payment)} />
      ) : (
        <p className='text-note text-fg-muted'>{getRefundPlaceholder(payment, paymentError)}</p>
      )}
    </Card>
  );
}
