import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import { useDeliveryByOrder } from '@/entities/delivery';
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, isOrderInFlow, useOrder } from '@/entities/order';
import { usePaymentByOrder, type PaymentStatus } from '@/entities/payment';
import { getErrorMessage } from '@/shared/api';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

import { OrderDeliveryMap } from './order-delivery-map';
import { OrderTrackingCard } from './order-tracking-card';

const ORDER_LIST_PATH = '/orders';
const SECONDARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg border border-border bg-surface px-4 text-body font-medium text-fg transition hover:bg-surface-hover';
const PAID_PAYMENT_STATUSES: PaymentStatus[] = ['APPROVED', 'CANCEL_REQUESTED', 'CANCELED'];

/**
 * U-09 주문 상세 화면. 주문(GET /orders/{id})·배달(GET /deliveries/by-order/{id})·결제(GET /payments/by-order/{id})를 합쳐 보여 준다.
 * 새로고침은 셋을 다시 받는다. 돈이 나간 결제면 결제 상세 링크를, 거절·취소 주문이면 환불 상태를 보여 준다.
 * 결제대기·결제만료 주문은 서버가 404 로 응답해 주문을 찾을 수 없다고 안내한다.
 * @returns 주문 상세 페이지
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
  const {
    data: payment,
    error: paymentError,
    isFetching: isPaymentFetching,
    refetch: refetchPayment,
  } = usePaymentByOrder(orderIdNumber);
  const isRefreshing = isOrderFetching || isDeliveryFetching || isPaymentFetching;

  /** 주문·배달·결제를 다시 받는다. */
  const handleRefreshClick = (): void => {
    void refetchOrder();
    void refetchDelivery();
    void refetchPayment();
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
              to={ORDER_LIST_PATH}
              className='text-note font-medium text-role-ink hover:underline'
            >
              주문내역으로
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-6'>
      <Link
        to={ORDER_LIST_PATH}
        className='self-start text-note text-fg-muted hover:text-fg'
      >
        ‹ 주문내역
      </Link>
      <PageHeader
        className='mb-4'
        title='주문 상세'
        badge={<Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>}
        actions={
          <Button
            variant='secondary'
            size='sm'
            disabled={isRefreshing}
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
        payment={payment}
        paymentError={paymentError}
      />

      {isOrderInFlow(order.status) ? (
        <OrderDeliveryMap
          order={order}
          delivery={delivery}
        />
      ) : null}

      <div className='mt-2 flex flex-wrap gap-2'>
        {payment && PAID_PAYMENT_STATUSES.includes(payment.status) ? (
          <Link
            to={`/payments/${payment.paymentId}`}
            className={SECONDARY_LINK_CLASS}
          >
            결제 상세 보기
          </Link>
        ) : null}
      </div>
    </div>
  );
}
