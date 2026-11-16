import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import { PAYMENT_STATUS_LABEL, PAYMENT_STATUS_TONE, usePayment, type PaymentDetail } from '@/entities/payment';
import { getErrorMessage } from '@/shared/api';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { getButtonClassName } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { KeyValueList, type KeyValueItem } from '@/shared/ui/key-value-list';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

const CONTAINER_CLASS =
  'mx-auto flex w-full flex-col gap-3 px-4 pt-1 pb-6 tablet:max-w-[560px] tablet:gap-3.5 tablet:px-0 tablet:pt-5 tablet:pb-10 desktop:max-w-[640px] desktop:gap-4 desktop:pt-7 desktop:pb-12';
const PAYMENT_LIST_PATH = '/payments';
const MISSING_PAYMENT_MESSAGE = '결제를 찾을 수 없어요.';

/**
 * 결제 정보 목록을 만든다. 승인번호는 카드 결제에만 있어서, 값이 없으면 '-'로 보여 준다.
 * @param payment - 결제 상세
 * @returns 라벨·값 목록
 */
const getPaymentInfoItems = (payment: PaymentDetail): KeyValueItem[] => [
  { label: '결제번호', value: payment.paymentId },
  { label: '주문번호', value: payment.orderId },
  { label: '결제수단', value: payment.method ?? '-' },
  { label: '승인번호', value: payment.approvalNumber ?? '-' },
  { label: '승인 시각', value: payment.approvedAt ? formatDateTime(payment.approvedAt) : '-' },
];

/**
 * 환불 정보 목록을 만든다. 환불 처리 중·환불 완료일 때만 쓴다.
 * @param payment - 결제 상세
 * @returns 라벨·값 목록
 */
const getRefundInfoItems = (payment: PaymentDetail): KeyValueItem[] => [
  { label: '환불 금액', value: formatPrice(payment.cancelAmount ?? payment.amount) },
  { label: '사유', value: payment.cancelReason ?? '-' },
  { label: '환불 완료', value: payment.canceledAt ? formatDateTime(payment.canceledAt) : '-' },
];

/**
 * 환불 처리 중·환불 완료 결제인지 확인한다.
 * @param payment - 결제 상세
 * @returns 환불 정보를 보여 줄지 여부
 */
const isRefundPayment = (payment: PaymentDetail): boolean =>
  payment.status === 'CANCEL_REQUESTED' || payment.status === 'CANCELED';

/**
 * 결제내역으로 돌아가는 링크와 함께 안내 문구를 그린다.
 * @param message - 안내 문구
 * @returns 안내 요소
 */
const renderNotice = (message: string): ReactNode => (
  <div className={CONTAINER_CLASS}>
    <EmptyState
      message={message}
      action={
        <Link
          to={PAYMENT_LIST_PATH}
          className='text-note font-medium text-role-ink hover:underline'
        >
          결제내역으로
        </Link>
      }
    />
  </div>
);

/**
 * U-11 결제 상세 화면. 결제 금액과 결제 정보(결제번호·주문번호·결제수단·승인번호·승인 시각)를 보여 주고 주문 상세로 이동한다.
 * 환불 처리 중·환불 완료 결제는 환불 금액·사유·환불 완료 시각을 함께 보여 준다.
 * 영수증 보기는 테스트 환경에서 토스 매출전표 데이터가 제공되지 않아 두지 않는다 (라이브 전환 때 receiptUrl로 연결).
 * 다른 고객의 결제(403)·없는 결제(404)는 서버 메시지로 안내한다.
 * @returns 결제 상세 페이지
 */
export function PaymentDetailPage(): ReactNode {
  const { paymentId } = useParams<{ paymentId: string }>();
  const id = Number(paymentId);
  const { data: payment, error, isPending } = usePayment(id);

  if (!Number.isInteger(id) || id <= 0) return renderNotice(MISSING_PAYMENT_MESSAGE);

  if (isPending) {
    return (
      <div className='flex items-center justify-center gap-2 px-4 py-10 text-note text-fg-muted'>
        <Spinner label='결제 상세 불러오는 중' />
        결제 정보를 불러오고 있어요.
      </div>
    );
  }

  if (error) return renderNotice(getErrorMessage(error));

  return (
    <div className={CONTAINER_CLASS}>
      <div>
        <Link
          to={PAYMENT_LIST_PATH}
          className='inline-flex min-h-11 items-center text-note text-fg-muted hover:text-fg'
        >
          ‹ 결제내역
        </Link>
        <PageHeader
          title='결제 상세'
          badge={<Badge tone={PAYMENT_STATUS_TONE[payment.status]}>{PAYMENT_STATUS_LABEL[payment.status]}</Badge>}
        />
      </div>

      <Card className='flex flex-col gap-3.5'>
        <div>
          <h2 className='text-note text-fg-muted'>결제 금액</h2>
          <p className='mt-1 text-title font-bold text-fg tabular-nums'>{formatPrice(payment.amount)}</p>
        </div>
        <KeyValueList
          className='border-t border-border pt-3.5 tabular-nums'
          labelWidth={110}
          items={getPaymentInfoItems(payment)}
        />
      </Card>

      {isRefundPayment(payment) ? (
        <Card className='flex flex-col gap-3.5'>
          <h2 className='font-bold text-fg'>환불 정보</h2>
          <KeyValueList
            className='tabular-nums'
            labelWidth={110}
            items={getRefundInfoItems(payment)}
          />
        </Card>
      ) : null}

      <Link
        to={`/orders/${payment.orderId}`}
        className={getButtonClassName({ size: 'lg', block: true })}
      >
        주문 상세 보기
      </Link>
    </div>
  );
}
