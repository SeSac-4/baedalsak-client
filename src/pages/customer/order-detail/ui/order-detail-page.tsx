import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import { useDeliveryByOrder, type Delivery } from '@/entities/delivery';
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TONE,
  isOrderInFlow,
  useOrder,
  type OrderStatus,
} from '@/entities/order';
import { usePaymentByOrder, type PaymentStatus } from '@/entities/payment';
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
import { RefundStatusCard } from './refund-status-card';

const ORDER_LIST_PATH = '/orders';
const CONTAINER_CLASS =
  'mx-auto flex w-full flex-col gap-3 px-4 pt-1 pb-6 tablet:max-w-[760px] tablet:gap-3.5 tablet:px-6 tablet:pt-5 tablet:pb-10 desktop:max-w-[1180px] desktop:gap-4 desktop:px-10 desktop:pt-7 desktop:pb-12';
const COLUMN_CLASS = 'flex min-w-0 flex-col gap-3 tablet:gap-3.5 desktop:gap-4';
const PAID_PAYMENT_STATUSES: PaymentStatus[] = ['APPROVED', 'CANCEL_REQUESTED', 'CANCELED'];

/**
 * 단계에 보여 줄 시각을 고른다. 서버에 단계별 이력이 없어 아는 시각만 쓴다:
 * 배달중 = 픽업 시각, 배달완료 = 완료 시각(배달 API). 결제완료·조리중은 시각 없음.
 * @param status 단계
 * @param delivery 배달 정보
 * @returns ISO 시각 (모르면 null)
 */
const getStepTime = (status: OrderStatus, delivery: Delivery | null | undefined): string | null => {
  if (status === 'DELIVERING') return delivery?.pickedUpAt ?? null;
  if (status === 'DELIVERED') return delivery?.completedAt ?? null;
  return null;
};

/**
 * 진행 단계(이름·시각)를 만든다. 결제대기는 고객에게 보이지 않아 결제완료부터 시작한다.
 * @param delivery 배달 정보
 * @returns 단계 목록
 */
const getOrderSteps = (delivery: Delivery | null | undefined): Step[] =>
  ORDER_STATUS_FLOW.map((status) => {
    const time = getStepTime(status, delivery);
    return { label: ORDER_STATUS_LABEL[status], time: time ? formatTime(time) : undefined };
  });

/**
 * U-09 주문 상세 화면. 주문(GET /orders/{id})·배달(GET /deliveries/by-order/{id})·결제(GET /payments/by-order/{id})를 합쳐 보여 준다.
 * 진행 중이면 진행 단계와 배달 현황(지도 포함)을, 거절·취소 주문이면 환불 현황을 보여 준다. 오른쪽(PC)·아래에는 주문 정보.
 * 새로고침은 셋을 다시 받는다. 결제대기·결제만료 주문은 서버가 404 로 응답해 주문을 찾을 수 없다고 안내한다.
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
      <div className={CONTAINER_CLASS}>
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

  const paymentDetailPath =
    payment && PAID_PAYMENT_STATUSES.includes(payment.status) ? `/payments/${payment.paymentId}` : undefined;

  return (
    <div className={CONTAINER_CLASS}>
      <div>
        <Link
          to={ORDER_LIST_PATH}
          className='inline-flex min-h-11 items-center text-note text-fg-muted hover:text-fg'
        >
          ‹ 주문내역
        </Link>
        <PageHeader
          title='주문 상세'
          badge={<Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>}
          actions={
            <IconButton
              icon='refresh'
              label='새로고침'
              disabled={isRefreshing}
              onClick={handleRefreshClick}
            />
          }
        />
      </div>

      <div className='flex flex-col gap-3 tablet:gap-3.5 desktop:grid desktop:grid-cols-[minmax(0,1fr)_340px] desktop:items-start desktop:gap-6'>
        <div className={COLUMN_CLASS}>
          {isOrderInFlow(order.status) ? (
            <>
              <Card className='px-2.5 py-4'>
                <Stepper
                  steps={getOrderSteps(delivery)}
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
            </>
          ) : (
            <RefundStatusCard
              order={order}
              payment={payment}
              paymentError={paymentError}
            />
          )}
        </div>
        <div className={`${COLUMN_CLASS} desktop:sticky desktop:top-30`}>
          <OrderInfoCard
            order={order}
            paymentDetailPath={paymentDetailPath}
          />
        </div>
      </div>
    </div>
  );
}
