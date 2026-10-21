import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import { PAYMENT_STATUS_LABEL, PAYMENT_STATUS_TONE, getPaymentMock } from '@/entities/payment';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { KeyValueList } from '@/shared/ui/key-value-list';
import { PageHeader } from '@/shared/ui/page-header';

const PRIMARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg bg-role px-4 text-body font-medium text-white transition hover:brightness-110';
const SECONDARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg border border-border bg-surface px-4 text-body font-medium text-fg transition hover:bg-surface-hover';

/**
 * U-11 결제 상세 화면. 결제 정보와 영수증·주문 상세 링크를 보여 준다. (목 데이터)
 * @returns 결제 상세 페이지
 */
export function PaymentDetailPage(): ReactNode {
  const { paymentId } = useParams<{ paymentId: string }>();
  const payment = getPaymentMock(Number(paymentId));

  if (!payment) {
    return (
      <div className='mx-auto max-w-[1100px] px-4 py-6'>
        <EmptyState
          message='결제를 찾을 수 없어요.'
          action={
            <Link
              to='/payments'
              className='text-note font-medium text-role hover:underline'
            >
              결제내역으로
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-6'>
      <Link
        to='/payments'
        className='self-start text-note text-fg-muted hover:text-fg'
      >
        ‹ 결제내역
      </Link>
      <PageHeader
        title='결제 상세'
        badge={<Badge tone={PAYMENT_STATUS_TONE[payment.status]}>{PAYMENT_STATUS_LABEL[payment.status]}</Badge>}
      />

      <Card className='flex max-w-[520px] flex-col gap-4'>
        <KeyValueList
          className='tabular-nums'
          items={[
            { label: '결제번호', value: payment.paymentId },
            { label: '주문번호', value: payment.orderId },
            { label: '결제 금액', value: formatPrice(payment.amount) },
            { label: '결제수단', value: payment.method ?? '-' },
            { label: '승인번호', value: payment.approvalNumber ?? '-' },
            { label: '승인 시각', value: payment.approvedAt ? formatDateTime(payment.approvedAt) : '-' },
          ]}
        />
        <div className='flex flex-wrap gap-2'>
          {payment.receiptUrl ? (
            <a
              href={payment.receiptUrl}
              target='_blank'
              rel='noreferrer'
              className={PRIMARY_LINK_CLASS}
            >
              영수증 보기
            </a>
          ) : null}
          <Link
            to={`/orders/${payment.orderId}`}
            className={SECONDARY_LINK_CLASS}
          >
            주문 상세 보기
          </Link>
        </div>
      </Card>
    </div>
  );
}
