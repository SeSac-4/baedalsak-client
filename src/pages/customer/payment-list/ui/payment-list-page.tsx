import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { usePaymentList } from '@/entities/payment';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { IconButton } from '@/shared/ui/icon-button';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

import { PaymentCard } from './payment-card';

const CONTAINER_CLASS =
  'mx-auto flex w-full flex-col gap-3 px-4 pt-1 pb-6 tablet:max-w-[760px] tablet:gap-3.5 tablet:px-6 tablet:pt-5 tablet:pb-10 desktop:max-w-[1180px] desktop:gap-4 desktop:px-10 desktop:pt-7 desktop:pb-12';
const CARD_LINK_CLASS = 'block rounded-card focus-visible:ring-2 focus-visible:ring-role/50 focus-visible:outline-none';
const NOTICE = '최근 결제부터 보여요. 테스트 환경이라 실제 출금은 없어요.';

/**
 * U-10 결제 목록 화면. 내 결제를 최신순 카드로 보여 주고, 카드를 누르면 결제 상세(U-11)로 간다. 더 보기로 다음 페이지를 이어 받는다.
 * @returns 결제 목록 페이지
 */
export function PaymentListPage(): ReactNode {
  const { data, error, isPending, isRefetching, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    usePaymentList();
  const payments = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <div className={CONTAINER_CLASS}>
      <PageHeader
        title='결제내역'
        description={NOTICE}
        actions={
          <IconButton
            icon='refresh'
            label='새로고침'
            disabled={isRefetching}
            onClick={() => void refetch()}
          />
        }
      />

      {isPending ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='결제내역 불러오는 중' />
          결제내역을 불러오고 있어요.
        </div>
      ) : null}

      {error && !data ? <EmptyState message={getErrorMessage(error)} /> : null}

      {data && payments.length === 0 ? (
        <EmptyState
          message='결제 내역이 없어요'
          description='주문을 결제하면 여기에 모여요.'
        />
      ) : null}

      {payments.length > 0 ? (
        <ul className='flex flex-col gap-3 tablet:grid tablet:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] tablet:items-start tablet:gap-3.5 desktop:gap-4'>
          {payments.map((payment) => (
            <li key={payment.paymentId}>
              <Link
                to={`/payments/${payment.paymentId}`}
                className={CARD_LINK_CLASS}
              >
                <PaymentCard payment={payment} />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {hasNextPage ? (
        <Button
          variant='secondary'
          size='lg'
          block
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        >
          {isFetchingNextPage ? '불러오는 중' : '더 보기'}
        </Button>
      ) : null}
    </div>
  );
}
