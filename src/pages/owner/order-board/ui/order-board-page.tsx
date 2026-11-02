import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';

import { OrderCard, useStoreOrderList, type OrderDetail, type OrderStatus } from '@/entities/order';
import { useMyStore } from '@/entities/store';
import { OperationStatusCard } from '@/features/store/toggle-operation-status';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';
import { Tabs, type TabItem } from '@/shared/ui/tabs';

import { AcceptOrderModal } from './accept-order-modal';

type BoardTab = 'new' | 'progress' | 'done';

/** 탭별로 보여 줄 주문 상태 */
const TAB_STATUSES: Record<BoardTab, OrderStatus[]> = {
  new: ['PAID'],
  progress: ['COOKING', 'DELIVERING'],
  done: ['DELIVERED'],
};

/** 탭별 빈 목록 안내 */
const EMPTY_MESSAGES: Record<BoardTab, string> = {
  new: '새 주문이 없어요. 고객이 결제하면 여기에 나타나요.',
  progress: '진행 중인 주문이 없어요.',
  done: '완료된 주문이 없어요.',
};

/**
 * 탭 문자열이 BoardTab인지 확인한다.
 * @param value Tabs가 넘긴 값
 * @returns BoardTab 여부
 */
const isBoardTab = (value: string): value is BoardTab => value in TAB_STATUSES;

/**
 * O-01 주문 관리(사장님 홈) 화면. 탭별 가게 주문(GET /stores/{id}/orders?status=)·상단 운영 상태를 보여 준다.
 * 신규 건수는 탭과 관계없이 신규(PAID) 목록의 전체 건수로 보여 준다. 새로고침은 지금 탭과 신규 건수를 다시 받는다.
 * @returns 주문 관리 페이지
 */
export function OrderBoardPage(): ReactNode {
  const { data: store } = useMyStore();
  const storeId = store?.id ?? 0;
  const [tab, setTab] = useState<BoardTab>('new');
  const [acceptTarget, setAcceptTarget] = useState<OrderDetail | null>(null);
  const { data, error, isPending, isFetching, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useStoreOrderList(storeId, TAB_STATUSES[tab]);
  const { data: newOrders, refetch: refetchNewOrders } = useStoreOrderList(storeId, TAB_STATUSES.new);
  const orders = data?.pages.flatMap((page) => page.content) ?? [];

  /** 지금 탭과 신규 건수를 다시 받는다. */
  const handleRefreshClick = (): void => {
    void refetch();
    void refetchNewOrders();
  };

  const tabItems: TabItem[] = [
    { value: 'new', label: '신규', count: newOrders?.pages[0]?.totalElements ?? 0 },
    { value: 'progress', label: '진행 중' },
    { value: 'done', label: '완료' },
  ];

  /**
   * 탭 전환 시 선택 탭을 바꾼다.
   * @param value 선택한 탭 값
   */
  const handleTabChange = (value: string): void => {
    if (isBoardTab(value)) setTab(value);
  };

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col px-4 py-6'>
      <PageHeader
        title='주문 관리'
        actions={
          <>
            {store ? (
              <OperationStatusCard
                store={store}
                compact
              />
            ) : null}
            <Button
              variant='secondary'
              size='sm'
              disabled={isFetching}
              onClick={handleRefreshClick}
            >
              새로고침
            </Button>
          </>
        }
      />

      <Tabs
        items={tabItems}
        value={tab}
        onChange={handleTabChange}
        className='mb-4'
      />

      {isPending ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='주문 불러오는 중' />
          주문을 불러오고 있어요.
        </div>
      ) : null}

      {error && !data ? <EmptyState message={getErrorMessage(error)} /> : null}

      {data && orders.length > 0 ? (
        <ul className='grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3'>
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard
                order={order}
                title={`주문 #${order.id}`}
                footer={
                  <div className='flex flex-col gap-2'>
                    <p className='text-note text-fg-muted'>
                      요청: {order.storeRequest ?? '없음'} · {order.deliveryAddress}
                    </p>
                    <div className='flex gap-2'>
                      {tab === 'new' ? (
                        <Button
                          size='sm'
                          onClick={() => setAcceptTarget(order)}
                        >
                          수락
                        </Button>
                      ) : null}
                      <Link
                        to={`/owner/orders/${order.id}`}
                        className='inline-flex h-7 items-center rounded-lg border border-border bg-surface px-2.5 text-note font-medium text-fg transition hover:bg-surface-hover'
                      >
                        상세 보기
                      </Link>
                    </div>
                  </div>
                }
              />
            </li>
          ))}
        </ul>
      ) : null}

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

      {data && orders.length === 0 ? <EmptyState message={EMPTY_MESSAGES[tab]} /> : null}

      <AcceptOrderModal
        key={acceptTarget?.id}
        order={acceptTarget}
        onClose={() => setAcceptTarget(null)}
        onAccepted={() => {
          setAcceptTarget(null);
          setTab('progress');
        }}
      />
    </div>
  );
}
