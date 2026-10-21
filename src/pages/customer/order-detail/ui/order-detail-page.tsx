import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import { getDeliveryMockByOrder } from '@/entities/delivery';
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, getOrderMock } from '@/entities/order';
import { RequestPaymentModal } from '@/features/payment/request-payment';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { OrderTrackingCard } from '@/widgets/order-tracking';

/**
 * U-09 주문 상세 화면. 진행 단계·주문 정보·배달 정보와 새로고침·결제 상세 링크를 보여 준다. (목 데이터)
 * 결제대기 주문이면 결제하기로 결제 팝업을 연다.
 * @returns 주문 상세 페이지
 */
export function OrderDetailPage(): ReactNode {
  const { orderId } = useParams<{ orderId: string }>();
  const order = getOrderMock(Number(orderId));
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);

  if (!order) {
    return (
      <div className='mx-auto max-w-[1100px] px-4 py-6'>
        <EmptyState
          message='주문을 찾을 수 없어요.'
          action={
            <Link
              to='/orders'
              className='text-note font-medium text-role hover:underline'
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
        to='/orders'
        className='self-start text-note text-fg-muted hover:text-fg'
      >
        ‹ 주문내역
      </Link>
      <PageHeader
        title='주문 상세'
        badge={<Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>}
        actions={
          <Button
            variant='secondary'
            size='sm'
          >
            새로고침
          </Button>
        }
      />

      <OrderTrackingCard
        order={order}
        delivery={getDeliveryMockByOrder(order.id)}
      />

      <div className='mt-2 flex flex-wrap gap-2'>
        {order.status === 'PENDING_PAYMENT' ? <Button onClick={() => setIsPaymentOpen(true)}>결제하기</Button> : null}
        {order.paymentId ? (
          <Link
            to={`/payments/${order.paymentId}`}
            className='inline-flex h-9 items-center rounded-lg border border-border bg-surface px-4 text-body font-medium text-fg transition hover:bg-surface-hover'
          >
            결제 상세 보기
          </Link>
        ) : null}
      </div>

      <RequestPaymentModal
        open={isPaymentOpen}
        storeId={order.storeId}
        storeName={order.storeName}
        orderId={order.id}
        amount={order.totalAmount}
        onClose={() => setIsPaymentOpen(false)}
      />
    </div>
  );
}
