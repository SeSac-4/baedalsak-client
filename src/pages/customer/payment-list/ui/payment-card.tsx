import type { ReactNode } from 'react';

import { PAYMENT_STATUS_LABEL, PAYMENT_STATUS_TONE, type PaymentSummary } from '@/entities/payment';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Icon } from '@/shared/ui/icon';

export interface PaymentCardProps {
  payment: PaymentSummary;
}

/**
 * 결제수단·주문번호 줄을 만든다. 서버 응답에 없는 값은 빼고, 둘 다 없으면 null.
 * @param payment - 결제 요약
 * @returns 예: 카드 · 주문 #1042
 */
const formatPaymentMeta = (payment: PaymentSummary): string | null => {
  const parts = [payment.method, payment.orderId ? `주문 #${payment.orderId}` : null].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : null;
};

/**
 * U-10 결제 카드. 승인 시각·상태 배지, 가게·결제수단·주문번호, 결제 금액을 보여 준다.
 * @param props payment(결제 요약)
 * @returns 결제 카드 요소
 */
export function PaymentCard({ payment }: PaymentCardProps): ReactNode {
  const meta = formatPaymentMeta(payment);

  return (
    <Card
      interactive
      padding='sm'
      className='flex flex-col gap-2'
    >
      <div className='flex items-center gap-2'>
        <span className='flex-1 text-note text-fg-muted tabular-nums'>
          {payment.approvedAt ? `${formatDateTime(payment.approvedAt)} 승인` : '승인 전'}
        </span>
        <Badge tone={PAYMENT_STATUS_TONE[payment.status]}>{PAYMENT_STATUS_LABEL[payment.status]}</Badge>
      </div>
      <div className='flex items-center gap-2'>
        <div className='min-w-0 flex-1'>
          <strong className='block truncate text-fg'>{payment.storeName}</strong>
          {meta ? <span className='block truncate text-note text-fg-muted'>{meta}</span> : null}
        </div>
        <strong className='text-title font-bold text-fg tabular-nums'>{formatPrice(payment.amount)}</strong>
        <Icon
          name='chevron-right'
          className='flex-none text-fg-subtle'
        />
      </div>
    </Card>
  );
}
