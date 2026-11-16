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
 * U-10 결제 카드. 결제 목록 응답의 승인 시각·상태 배지, 가게, 결제 금액을 보여 준다.
 * @param props payment(결제 요약)
 * @returns 결제 카드 요소
 */
export function PaymentCard({ payment }: PaymentCardProps): ReactNode {
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
        <strong className='min-w-0 flex-1 truncate text-fg'>{payment.storeName}</strong>
        <strong className='text-title font-bold text-fg tabular-nums'>{formatPrice(payment.amount)}</strong>
        <Icon
          name='chevron-right'
          className='flex-none text-fg-subtle'
        />
      </div>
    </Card>
  );
}
