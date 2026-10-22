import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { getOrderMock } from '@/entities/order';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';

import { PaymentWidgetCard } from './payment-widget-card';

/** 처음 선택된 결제수단 (목업) */
const DEFAULT_PAYMENT_METHOD = '신용·체크카드';

/**
 * U-05 결제 화면. 결제대기 주문의 결제위젯(목업)과 결제 금액을 보여 주고, 결제하면 결제 완료로 이동한다. (목 데이터)
 * 토스 결제위젯·결제 요청 연동은 #25에서 한다.
 * @returns 결제 페이지
 */
export function PaymentPage(): ReactNode {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const order = getOrderMock(Number(orderId));
  const [selectedMethod, setSelectedMethod] = useState<string>(DEFAULT_PAYMENT_METHOD);
  const [isAgreed, setIsAgreed] = useState<boolean>(true);

  /**
   * 결제 완료 화면으로 이동한다. (결제 요청·승인 API 연동 전 임시)
   */
  const handlePayClick = (): void => {
    navigate('/payment/success');
  };

  if (!order || order.status !== 'PENDING_PAYMENT') {
    return (
      <div className='mx-auto max-w-[1100px] px-4 py-6'>
        <EmptyState
          message='결제할 수 있는 주문이 아니에요.'
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
        to={`/orders/${order.id}`}
        className='self-start text-note text-fg-muted hover:text-fg'
      >
        ‹ 주문 상세
      </Link>
      <PageHeader title='결제하기' />

      <div className='grid gap-4 tablet:grid-cols-[1fr_300px] tablet:items-start'>
        <PaymentWidgetCard
          selectedMethod={selectedMethod}
          isAgreed={isAgreed}
          onMethodChange={setSelectedMethod}
          onAgreementChange={setIsAgreed}
        />

        <aside className='tablet:sticky tablet:top-4'>
          <Card className='flex flex-col gap-2'>
            <strong className='text-body text-fg'>{order.storeName}</strong>
            <p className='text-note text-fg-muted tabular-nums'>주문번호 {order.id}</p>
            <div className='flex justify-between border-t border-border pt-2 text-body font-bold tabular-nums'>
              <span className='text-fg'>결제 금액</span>
              <span className='text-fg'>{formatPrice(order.totalAmount)}</span>
            </div>
            <Button
              size='lg'
              block
              disabled={!isAgreed}
              onClick={handlePayClick}
            >
              {formatPrice(order.totalAmount)} 결제하기
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
