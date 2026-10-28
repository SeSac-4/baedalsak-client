import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import { useDeliveryByOrder } from '@/entities/delivery';
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, getOrderMock } from '@/entities/order';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { OrderTrackingCard } from '@/widgets/order-tracking';

/**
 * O-03 사장님 주문 상세 화면. 진행 단계·주문 정보·배달 정보와 새로고침을 보여 준다. (주문은 목 데이터, 배달 정보는 GET /deliveries/by-order/{orderId})
 * @returns 사장님 주문 상세 페이지
 */
export function OrderDetailPage(): ReactNode {
  const { orderId } = useParams<{ orderId: string }>();
  const order = getOrderMock(Number(orderId));
  const {
    data: delivery,
    error: deliveryError,
    isFetching: isDeliveryFetching,
    refetch: refetchDelivery,
  } = useDeliveryByOrder(Number(orderId));

  if (!order || order.status === 'PENDING_PAYMENT') {
    return (
      <div className='mx-auto max-w-[1100px] px-4 py-6'>
        <EmptyState
          message='주문을 찾을 수 없어요.'
          action={
            <Link
              to='/owner/orders'
              className='text-note font-medium text-role hover:underline'
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
        title={`주문 #${order.id}`}
        badge={<Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>}
        actions={
          <Button
            variant='secondary'
            size='sm'
            disabled={isDeliveryFetching}
            onClick={() => void refetchDelivery()}
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
