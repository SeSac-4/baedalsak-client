import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { OrderCard, useOrderList } from '@/entities/order';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

const STORE_LIST_LINK_CLASS = 'text-note font-medium text-role-ink hover:underline';

/**
 * U-08 주문 목록 화면. 내 주문(GET /orders)을 최신순 카드로 보여 주고, '더 보기'로 다음 페이지를 이어 받는다.
 * @returns 주문 목록 페이지
 */
export function OrderListPage(): ReactNode {
  const { data, error, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } = useOrderList();
  const orders = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col px-4 py-6'>
      <PageHeader
        className='mb-4'
        title='주문내역'
      />

      {isPending ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='주문내역 불러오는 중' />
          주문내역을 불러오고 있어요.
        </div>
      ) : null}

      {error && !data ? <EmptyState message={getErrorMessage(error)} /> : null}

      {data && orders.length > 0 ? (
        <>
          <ul className='grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3'>
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/orders/${order.id}`}
                  className='block rounded-xl focus-visible:ring-2 focus-visible:ring-role/50 focus-visible:outline-none'
                >
                  <OrderCard
                    order={order}
                    interactive
                  />
                </Link>
              </li>
            ))}
          </ul>
          {hasNextPage ? (
            <Button
              variant='secondary'
              className='mt-4 self-center'
              disabled={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              {isFetchingNextPage ? '불러오는 중' : '더 보기'}
            </Button>
          ) : null}
        </>
      ) : null}

      {data && orders.length === 0 ? (
        <EmptyState
          message='아직 주문이 없어요.'
          action={
            <Link
              to='/'
              className={STORE_LIST_LINK_CLASS}
            >
              가게 둘러보기
            </Link>
          }
        />
      ) : null}
    </div>
  );
}
