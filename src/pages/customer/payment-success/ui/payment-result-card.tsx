import type { ReactNode } from 'react';
import { Link } from 'react-router';

import type { PaymentDetail } from '@/entities/payment';
import { formatPrice } from '@/shared/lib/format';
import { Card } from '@/shared/ui/card';
import { KeyValueList } from '@/shared/ui/key-value-list';

const PRIMARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg bg-role px-4 text-body font-medium text-white transition hover:brightness-110';
const SECONDARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg border border-border bg-surface px-4 text-body font-medium text-fg transition hover:bg-surface-hover';

export interface PaymentResultCardProps {
  /** 승인된 결제 상세 */
  payment: PaymentDetail;
}

/**
 * U-06 결제 승인 결과. 주문번호·금액·결제수단·승인번호와 주문 상세·홈 버튼을 보여 준다.
 * 승인번호는 값이 있을 때만 보여 준다 (카드 결제가 아니거나 server #16 전이면 없음).
 * @param props payment(승인된 결제 상세)
 * @returns 결제 승인 결과 요소
 */
export function PaymentResultCard({ payment }: PaymentResultCardProps): ReactNode {
  return (
    <div className='mx-auto flex max-w-[520px] flex-col items-center gap-4 px-4 py-6 text-center'>
      <div
        aria-hidden
        className='flex size-14 items-center justify-center rounded-full bg-ok-soft text-title font-bold text-ok'
      >
        ✓
      </div>
      <div className='flex flex-col gap-1'>
        <h2 className='text-title font-bold text-fg'>결제가 완료되었어요</h2>
        <p className='text-body text-fg-muted'>가게에서 주문을 확인하면 조리가 시작돼요.</p>
      </div>
      <Card className='w-full text-left'>
        <KeyValueList
          className='tabular-nums'
          items={[
            { label: '주문번호', value: payment.orderId },
            { label: '결제 금액', value: formatPrice(payment.amount) },
            { label: '결제수단', value: payment.method ?? '-' },
            ...(payment.approvalNumber ? [{ label: '승인번호', value: payment.approvalNumber }] : []),
          ]}
        />
      </Card>
      <div className='flex flex-wrap justify-center gap-2'>
        <Link
          to={`/orders/${payment.orderId}`}
          className={PRIMARY_LINK_CLASS}
        >
          주문 상세 보기
        </Link>
        <Link
          to='/'
          className={SECONDARY_LINK_CLASS}
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
