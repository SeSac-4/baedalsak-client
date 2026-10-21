import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';

import { OrderCard, STORE_ORDER_LIST_MOCK, type OrderDetail, type OrderStatus } from '@/entities/order';
import { STORE_DETAIL_MOCK } from '@/entities/store';
import { OperationStatusCard } from '@/features/store/toggle-operation-status';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Tabs, type TabItem } from '@/shared/ui/tabs';

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
 * 탭에 해당하는 주문만 고른다.
 * @param orders 가게 주문 목록
 * @param tab 선택한 탭
 * @returns 탭에 해당하는 주문
 */
const getOrdersByTab = (orders: OrderDetail[], tab: BoardTab): OrderDetail[] =>
  orders.filter((order) => TAB_STATUSES[tab].includes(order.status));

/**
 * 탭 문자열이 BoardTab인지 확인한다.
 * @param value Tabs가 넘긴 값
 * @returns BoardTab 여부
 */
const isBoardTab = (value: string): value is BoardTab => value in TAB_STATUSES;

/**
 * O-01 주문 관리(사장님 홈) 화면. 신규·진행 중·완료 탭, 주문 카드, 상단 운영 상태를 보여 준다. (목 데이터)
 * @returns 주문 관리 페이지
 */
export function OrderBoardPage(): ReactNode {
  const [tab, setTab] = useState<BoardTab>('new');
  const orders = getOrdersByTab(STORE_ORDER_LIST_MOCK, tab);

  const tabItems: TabItem[] = [
    { value: 'new', label: '신규', count: getOrdersByTab(STORE_ORDER_LIST_MOCK, 'new').length },
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
            <OperationStatusCard
              status={STORE_DETAIL_MOCK.operationStatus}
              compact
            />
            <Button
              variant='secondary'
              size='sm'
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

      {orders.length > 0 ? (
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
                      {tab === 'new' ? <Button size='sm'>수락</Button> : null}
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
      ) : (
        <EmptyState message={EMPTY_MESSAGES[tab]} />
      )}
    </div>
  );
}
