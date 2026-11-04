import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import { useDeliveryByOrder, type Delivery } from '@/entities/delivery';
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TONE,
  useOrder,
  type OrderDetail,
  type OrderStatus,
} from '@/entities/order';
import { getErrorMessage } from '@/shared/api';
import { formatTime } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { IconButton } from '@/shared/ui/icon-button';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';
import { Stepper, type Step } from '@/shared/ui/stepper';

import { DeliveryStatusCard } from './delivery-status-card';
import { OrderInfoCard } from './order-info-card';

/**
 * 단계에 보여 줄 시각을 고른다. 서버에 단계별 이력이 없어 아는 시각만 쓴다.
 * @param status 단계
 * @param order 주문 상세
 * @param delivery 배달 정보
 * @returns ISO 시각 (모르면 null)
 */
const getStepTime = (status: OrderStatus, order: OrderDetail, delivery: Delivery | null | undefined): string | null => {
  if (status === 'PENDING_PAYMENT') return order.createdAt;
  if (status === 'DELIVERING') return delivery?.pickedUpAt ?? null;
  if (status === 'DELIVERED') return delivery?.completedAt ?? null;
  return null;
};

/**
 * 진행 단계(이름·시각)를 만든다.
 * @param order 주문 상세
 * @param delivery 배달 정보
 * @returns 단계 목록
 */
const getOrderSteps = (order: OrderDetail, delivery: Delivery | null | undefined): Step[] =>
  ORDER_STATUS_FLOW.map((status) => {
    const time = getStepTime(status, order, delivery);
    return { label: ORDER_STATUS_LABEL[status], time: time ? formatTime(time) : undefined };
  });

/**
 * O-03 사장님 주문 상세 화면. 주문(GET /orders/{id})·배달(GET /deliveries/by-order/{id})을 합쳐 보여 주고, 새로고침은 둘을 다시 받는다.
 * 내 가게 주문이 아니면(403)·없으면(404) 서버 메시지로 안내한다.
 * @returns 사장님 주문 상세 페이지
 */
export function OrderDetailPage(): ReactNode {
  const { orderId } = useParams<{ orderId: string }>();
  const orderIdNumber = Number(orderId);
  const { data: order, error, isPending, isFetching: isOrderFetching, refetch: refetchOrder } = useOrder(orderIdNumber);
  const {
    data: delivery,
    error: deliveryError,
    isFetching: isDeliveryFetching,
    refetch: refetchDelivery,
  } = useDeliveryByOrder(orderIdNumber);

  /** 주문·배달을 다시 받는다. */
  const handleRefreshClick = (): void => {
    void refetchOrder();
    void refetchDelivery();
  };

  if (isPending) {
    return (
      <div className='flex items-center justify-center gap-2 py-16 text-note text-fg-muted'>
        <Spinner label='주문 정보 불러오는 중' />
        주문 정보를 불러오고 있어요.
      </div>
    );
  }

  if (!order) {
    return (
      <EmptyState
        message={error ? getErrorMessage(error) : '주문을 찾을 수 없어요.'}
        action={
          <Link
            to='/owner/orders'
            className='text-note font-medium text-role-ink hover:underline'
          >
            주문 관리로
          </Link>
        }
      />
    );
  }

  return (
    <div className='flex flex-col gap-3 tablet:gap-3.5 desktop:gap-4'>
      <div>
        <Link
          to='/owner/orders'
          className='inline-flex min-h-11 items-center text-note text-fg-muted hover:text-fg'
        >
          ‹ 주문 관리
        </Link>
        <PageHeader
          title={`주문 #${order.id}`}
          badge={<Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>}
          actions={
            <IconButton
              icon='refresh'
              label='새로고침'
              disabled={isOrderFetching || isDeliveryFetching}
              onClick={handleRefreshClick}
            />
          }
        />
      </div>
      <div className='flex flex-col gap-3 tablet:gap-3.5 desktop:grid desktop:grid-cols-[minmax(0,1fr)_340px] desktop:items-start desktop:gap-6'>
        <div className='flex min-w-0 flex-col gap-3 tablet:gap-3.5 desktop:gap-4'>
          <Card className='px-2.5 py-4'>
            <Stepper
              steps={getOrderSteps(order, delivery)}
              current={ORDER_STATUS_FLOW.indexOf(order.status)}
            />
          </Card>
          {order.status === 'PAID' ? null : (
            <DeliveryStatusCard
              order={order}
              delivery={delivery}
              deliveryError={deliveryError}
            />
          )}
        </div>
        <OrderInfoCard order={order} />
      </div>
    </div>
  );
}
