import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { ORDER_LIST_MOCK, OrderCard } from '@/entities/order';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';

/**
 * U-08 주문 목록 화면. 내 주문을 최신순 카드로 보여 준다. (목 데이터)
 * @returns 주문 목록 페이지
 */
export function OrderListPage(): ReactNode {
  const orders = ORDER_LIST_MOCK;

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col px-4 py-6'>
      <PageHeader title='주문내역' />
      {orders.length > 0 ? (
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
          <Button
            variant='secondary'
            className='mt-4 self-center'
          >
            더 보기
          </Button>
        </>
      ) : (
        <EmptyState
          message='아직 주문이 없어요.'
          action={
            <Link
              to='/'
              className='text-note font-medium text-role hover:underline'
            >
              가게 둘러보기
            </Link>
          }
        />
      )}
    </div>
  );
}
