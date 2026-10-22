import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { PAYMENT_LIST_MOCK, PAYMENT_STATUS_LABEL, PAYMENT_STATUS_TONE } from '@/entities/payment';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { DataTable } from '@/shared/ui/data-table';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';

/**
 * U-10 결제 목록 화면. 내 결제를 최신순 표로 보여 준다. (목 데이터)
 * @returns 결제 목록 페이지
 */
export function PaymentListPage(): ReactNode {
  const payments = PAYMENT_LIST_MOCK;

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col px-4 py-6'>
      <PageHeader
        title='결제내역'
        badge={<span className='text-note text-fg-muted'>최신순</span>}
      />
      {payments.length > 0 ? (
        <DataTable>
          <thead>
            <tr>
              <th>결제일시</th>
              <th>결제번호</th>
              <th className='text-right'>금액</th>
              <th>상태</th>
              <th>
                <span className='sr-only'>상세</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.paymentId}>
                <td>{payment.approvedAt ? formatDateTime(payment.approvedAt) : '-'}</td>
                <td>{payment.paymentId}</td>
                <td className='text-right'>{formatPrice(payment.amount)}</td>
                <td>
                  <Badge tone={PAYMENT_STATUS_TONE[payment.status]}>{PAYMENT_STATUS_LABEL[payment.status]}</Badge>
                </td>
                <td className='text-right'>
                  <Link
                    to={`/payments/${payment.paymentId}`}
                    className='text-note font-medium text-role hover:underline'
                  >
                    상세
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      ) : (
        <EmptyState
          message='결제 내역이 없어요.'
          action={
            <Link
              to='/orders'
              className='text-note font-medium text-role hover:underline'
            >
              주문내역 보기
            </Link>
          }
        />
      )}
    </div>
  );
}
