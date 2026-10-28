import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { PAYMENT_STATUS_LABEL, PAYMENT_STATUS_TONE, usePaymentList } from '@/entities/payment';
import { getErrorMessage } from '@/shared/api';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DataTable } from '@/shared/ui/data-table';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

const LINK_CLASS = 'text-note font-medium text-role hover:underline';

/**
 * 결제 목록 화면 틀(제목·최신순 표시) 안에 내용을 그린다.
 * @param content 목록 영역 내용
 * @returns 결제 목록 페이지 요소
 */
const renderPageLayout = (content: ReactNode): ReactNode => (
  <div className='mx-auto flex max-w-[1100px] flex-col px-4 py-6'>
    <PageHeader
      title='결제내역'
      badge={<span className='text-note text-fg-muted'>최신순</span>}
    />
    {content}
  </div>
);

/**
 * U-10 결제 목록 화면. 내 결제를 최신순 표로 보여 주고, 더 보기로 다음 페이지를 불러온다.
 * @returns 결제 목록 페이지
 */
export function PaymentListPage(): ReactNode {
  const { data, error, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } = usePaymentList();

  if (isPending) {
    return renderPageLayout(
      <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
        <Spinner label='결제내역 불러오는 중' />
        결제내역을 불러오고 있어요.
      </div>,
    );
  }

  if (error) return renderPageLayout(<EmptyState message={getErrorMessage(error)} />);

  const payments = data.pages.flatMap((page) => page.content);

  if (payments.length === 0) {
    return renderPageLayout(
      <EmptyState
        message='결제 내역이 없어요.'
        action={
          <Link
            to='/orders'
            className={LINK_CLASS}
          >
            주문내역 보기
          </Link>
        }
      />,
    );
  }

  return renderPageLayout(
    <>
      <DataTable>
        <thead>
          <tr>
            <th>승인 시각</th>
            <th>가게</th>
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
              <td>{payment.storeName}</td>
              <td className='text-right'>{formatPrice(payment.amount)}</td>
              <td>
                <Badge tone={PAYMENT_STATUS_TONE[payment.status]}>{PAYMENT_STATUS_LABEL[payment.status]}</Badge>
              </td>
              <td className='text-right'>
                <Link
                  to={`/payments/${payment.paymentId}`}
                  className={LINK_CLASS}
                >
                  상세
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {hasNextPage ? (
        <Button
          variant='secondary'
          className='mt-4 self-center'
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        >
          {isFetchingNextPage ? '불러오는 중…' : '더 보기'}
        </Button>
      ) : null}
    </>,
  );
}
