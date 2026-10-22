import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { getPaymentMock } from '@/entities/payment';
import { formatPrice } from '@/shared/lib/format';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { KeyValueList } from '@/shared/ui/key-value-list';

/** 결제 승인 응답 자리 — 승인 완료 목 결제 (승인 API 연동 전 임시) */
const CONFIRMED_PAYMENT_ID_MOCK = 504;

const PRIMARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg bg-role px-4 text-body font-medium text-white transition hover:brightness-110';
const SECONDARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg border border-border bg-surface px-4 text-body font-medium text-fg transition hover:bg-surface-hover';

/**
 * U-06 결제 완료 화면. 주문번호·금액·결제수단·승인번호와 주문 상세·홈 버튼을 보여 준다. (목 데이터)
 * @returns 결제 완료 페이지
 */
export function PaymentSuccessPage(): ReactNode {
  const payment = getPaymentMock(CONFIRMED_PAYMENT_ID_MOCK);

  if (!payment) {
    return (
      <div className='mx-auto max-w-[1100px] px-4 py-6'>
        <EmptyState message='결제 정보를 찾을 수 없어요.' />
      </div>
    );
  }

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
            { label: '승인번호', value: payment.approvalNumber ?? '-' },
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
