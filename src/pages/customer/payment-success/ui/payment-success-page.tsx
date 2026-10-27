import type { ReactNode } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router';
import axios from 'axios';

import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Spinner } from '@/shared/ui/spinner';

import type { ConfirmPaymentRequest } from '../model/confirm-payment-types';
import { useConfirmPayment } from '../model/use-confirm-payment';
import { PaymentResultCard } from './payment-result-card';

/** 결제 화면이 successUrl에 붙여 둔 주문 ID 쿼리 이름 (payment-form.tsx와 같은 값) */
const ORDER_ID_PARAM = 'order';
const PAYMENT_FAIL_PATH = '/payment/fail';
const MISSING_PAYMENT_MESSAGE = '결제 정보를 찾을 수 없어요.';
const ORDER_LIST_LINK_CLASS = 'text-note font-medium text-role hover:underline';

const HTTP_BAD_REQUEST = 400;
const HTTP_CONFLICT = 409;
const HTTP_BAD_GATEWAY = 502;

/**
 * 토스 successUrl 쿼리(paymentKey·orderId·amount)를 승인 요청으로 바꾼다.
 * @param searchParams 현재 주소의 쿼리
 * @returns 승인 요청, 값이 빠졌거나 금액이 올바르지 않으면 null
 */
const parseConfirmRequest = (searchParams: URLSearchParams): ConfirmPaymentRequest | null => {
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = Number(searchParams.get('amount'));
  if (!paymentKey || !orderId || !Number.isInteger(amount) || amount <= 0) return null;

  return { paymentKey, orderId, amount };
};

/**
 * 결제 화면이 successUrl에 붙여 둔 주문 ID를 읽는다.
 * @param searchParams 현재 주소의 쿼리
 * @returns 주문 ID, 없거나 숫자가 아니면 null
 */
const parseOrderId = (searchParams: URLSearchParams): number | null => {
  const orderId = Number(searchParams.get(ORDER_ID_PARAM));
  return Number.isInteger(orderId) && orderId > 0 ? orderId : null;
};

/**
 * 요청 오류의 HTTP 상태 코드를 꺼낸다.
 * @param error 요청 오류
 * @returns 상태 코드, 응답이 없으면 undefined
 */
const getErrorStatus = (error: unknown): number | undefined =>
  axios.isAxiosError(error) ? error.response?.status : undefined;

/**
 * 주문내역 링크를 그린다.
 * @returns 주문내역 링크 요소
 */
const renderOrderListLink = (): ReactNode => (
  <Link
    to='/orders'
    className={ORDER_LIST_LINK_CLASS}
  >
    주문내역으로
  </Link>
);

/**
 * U-06 결제 승인 화면. 토스 successUrl 쿼리로 결제를 승인하고 승인 결과를 보여 준다.
 * 이미 승인된 결제(409)는 주문 상세로, 금액 불일치 등(400)은 결제 실패 안내로 보낸다.
 * 토스 승인 실패(502)는 재시도 버튼으로 같은 승인을 다시 요청한다.
 * @returns 결제 승인 페이지
 */
export function PaymentSuccessPage(): ReactNode {
  const [searchParams] = useSearchParams();
  const confirmRequest = parseConfirmRequest(searchParams);
  const orderId = parseOrderId(searchParams);
  const { data: payment, error, isPending, isFetching, refetch } = useConfirmPayment(confirmRequest);

  if (!confirmRequest) {
    return (
      <div className='mx-auto max-w-[1100px] px-4 py-6'>
        <EmptyState
          message={MISSING_PAYMENT_MESSAGE}
          action={renderOrderListLink()}
        />
      </div>
    );
  }

  if (payment) return <PaymentResultCard payment={payment} />;

  if (isPending || isFetching) {
    return (
      <div className='flex items-center justify-center gap-2 px-4 py-10 text-note text-fg-muted'>
        <Spinner label='결제 확인 중' />
        결제를 확인하고 있어요.
      </div>
    );
  }

  const status = getErrorStatus(error);

  if (status === HTTP_CONFLICT && orderId !== null) {
    return (
      <Navigate
        to={`/orders/${orderId}`}
        replace
      />
    );
  }

  if (status === HTTP_BAD_REQUEST) {
    return (
      <Navigate
        to={PAYMENT_FAIL_PATH}
        replace
      />
    );
  }

  return (
    <div className='mx-auto max-w-[1100px] px-4 py-6'>
      <EmptyState
        message={getErrorMessage(error)}
        action={
          status === HTTP_BAD_GATEWAY ? (
            <Button onClick={() => void refetch()}>다시 시도</Button>
          ) : (
            renderOrderListLink()
          )
        }
      />
    </div>
  );
}
