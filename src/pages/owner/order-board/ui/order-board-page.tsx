import { useState, type ReactNode } from 'react';

import { useStoreOrderList, type OrderDetail, type OrderStatus } from '@/entities/order';
import { useMyStore } from '@/entities/store';
import { OperationStatusCard } from '@/features/store/toggle-operation-status';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { IconButton } from '@/shared/ui/icon-button';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';
import { Tabs, type TabItem } from '@/shared/ui/tabs';

import { AcceptOrderModal } from './accept-order-modal';
import { OrderBoardCard } from './order-board-card';

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
 * O-01 주문 관리(사장님 홈) 화면. 운영 상태와 탭별 가게 주문(GET /stores/{id}/orders?status=)을 보여 준다.
 * 탭의 개수는 고른 탭과 관계없이 각 목록의 전체 건수로 보여 주고, 새로고침은 세 목록을 모두 다시 받는다.
 * @returns 주문 관리 페이지
 */
export function OrderBoardPage(): ReactNode {
  const { data: store } = useMyStore();
  const storeId = store?.id ?? 0;
  const [tab, setTab] = useState<BoardTab>('new');
  const [acceptTarget, setAcceptTarget] = useState<OrderDetail | null>(null);
  const newOrders = useStoreOrderList(storeId, TAB_STATUSES.new);
  const progressOrders = useStoreOrderList(storeId, TAB_STATUSES.progress);
  const doneOrders = useStoreOrderList(storeId, TAB_STATUSES.done);
  const tabQueries = { new: newOrders, progress: progressOrders, done: doneOrders };
  const { data, error, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } = tabQueries[tab];
  const orders = data?.pages.flatMap((page) => page.content) ?? [];
  const isRefreshing = newOrders.isFetching || progressOrders.isFetching || doneOrders.isFetching;

  /** 세 목록을 다시 받는다. */
  const handleRefreshClick = (): void => {
    void newOrders.refetch();
    void progressOrders.refetch();
    void doneOrders.refetch();
  };

  const tabItems: TabItem[] = [
    { value: 'new', label: '신규', count: newOrders.data?.pages[0]?.totalElements ?? 0, isEmphasized: true },
    { value: 'progress', label: '진행 중', count: progressOrders.data?.pages[0]?.totalElements ?? 0 },
    { value: 'done', label: '완료', count: doneOrders.data?.pages[0]?.totalElements ?? 0 },
  ];

  /**
   * 탭 전환 시 선택 탭을 바꾼다.
   * @param value 선택한 탭 값
   */
  const handleTabChange = (value: string): void => {
    if (isBoardTab(value)) setTab(value);
  };

  return (
    <div className='flex flex-col gap-3 tablet:gap-3.5 desktop:gap-4'>
      <PageHeader
        title='주문 관리'
        actions={
          <IconButton
            icon='refresh'
            label='새로고침'
            disabled={isRefreshing}
            onClick={handleRefreshClick}
          />
        }
      />

      {store ? <OperationStatusCard store={store} /> : null}

      <Tabs
        items={tabItems}
        value={tab}
        onChange={handleTabChange}
        label='주문 상태'
      />

      {isPending ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='주문 불러오는 중' />
          주문을 불러오고 있어요.
        </div>
      ) : null}

      {error && !data ? <EmptyState message={getErrorMessage(error)} /> : null}

      {data && orders.length > 0 ? (
        <ul className='grid grid-cols-1 items-start gap-3 tablet:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] tablet:gap-3.5 desktop:gap-4'>
          {orders.map((order) => (
            <li key={order.id}>
              <OrderBoardCard
                order={order}
                onAcceptClick={setAcceptTarget}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {hasNextPage ? (
        <Button
          variant='secondary'
          className='self-center'
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        >
          {isFetchingNextPage ? '불러오는 중' : '더 보기'}
        </Button>
      ) : null}

      {data && orders.length === 0 ? (
        <EmptyState
          icon='receipt'
          message={EMPTY_MESSAGES[tab]}
        />
      ) : null}

      {acceptTarget ? (
        <AcceptOrderModal
          order={acceptTarget}
          onClose={() => setAcceptTarget(null)}
          onAccepted={() => {
            setAcceptTarget(null);
            setTab('progress');
          }}
        />
      ) : null}
    </div>
  );
}
