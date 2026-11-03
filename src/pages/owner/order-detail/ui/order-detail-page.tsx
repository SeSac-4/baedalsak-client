import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import { useDeliveryByOrder } from '@/entities/delivery';
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, useOrder } from '@/entities/order';
import { getErrorMessage } from '@/shared/api';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';
import { OrderTrackingCard } from '@/widgets/order-tracking';

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
      <div className='mx-auto max-w-[1100px] px-4 py-6'>
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
      </div>
    );
  }

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-6'>
      <Link
        to='/owner/orders'
        className='self-start text-note text-fg-muted hover:text-fg'
      >
        ‹ 주문 관리
      </Link>
      <PageHeader
        className='mb-4'
        title={`주문 #${order.id}`}
        badge={<Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>}
        actions={
          <Button
            variant='secondary'
            size='sm'
            disabled={isOrderFetching || isDeliveryFetching}
            onClick={handleRefreshClick}
          >
            새로고침
          </Button>
        }
      />
      <OrderTrackingCard
        order={order}
        delivery={delivery}
        deliveryError={deliveryError}
      />
    </div>
  );
}
