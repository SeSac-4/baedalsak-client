import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import { usePaymentReady } from '@/features/payment/request-payment';
import { getErrorMessage } from '@/shared/api';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

import { PaymentForm } from './payment-form';

const ORDER_LIST_LINK_CLASS = 'text-note font-medium text-role hover:underline';

/**
 * U-05 결제 화면. 진입 시 결제 요청(POST /payments)을 만들고, 받은 금액·주문명으로 토스 결제위젯과 결제하기를 보여 준다.
 * 결제대기가 아닌 주문(409)·없는 주문(404)·다른 고객 주문(403) 등 요청 실패는 서버 메시지로 안내한다.
 * @returns 결제 페이지
 */
export function PaymentPage(): ReactNode {
  const { orderId } = useParams<{ orderId: string }>();
  const orderIdNumber = Number(orderId);
  const { data: paymentReady, error, isPending } = usePaymentReady(orderIdNumber);

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-6'>
      <Link
        to={`/orders/${orderIdNumber}`}
        className='self-start text-note text-fg-muted hover:text-fg'
      >
        ‹ 주문 상세
      </Link>
      <PageHeader title='결제하기' />

      {paymentReady ? (
        <PaymentForm
          orderId={orderIdNumber}
          paymentReady={paymentReady}
        />
      ) : null}

      {!paymentReady && isPending ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='결제 정보 불러오는 중' />
          결제 정보를 불러오고 있어요.
        </div>
      ) : null}

      {!paymentReady && error ? (
        <EmptyState
          message={getErrorMessage(error)}
          action={
            <Link
              to='/orders'
              className={ORDER_LIST_LINK_CLASS}
            >
              주문내역으로
            </Link>
          }
        />
      ) : null}
    </div>
  );
}
