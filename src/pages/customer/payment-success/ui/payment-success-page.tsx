import type { ReactNode } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router';

import { getErrorCode, getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Spinner } from '@/shared/ui/spinner';

import type { ConfirmPaymentRequest } from '../model/confirm-payment-types';
import { useConfirmPayment } from '../model/use-confirm-payment';
import { PaymentResultCard } from './payment-result-card';

/** 주문서가 successUrl에 붙여 둔 주문 ID 쿼리 이름 (checkout-form.tsx·payment-form.tsx와 같은 값) */
const ORDER_ID_PARAM = 'order';
const PAYMENT_FAIL_PATH = '/payment/fail';
/** 결제 실패 안내(U-07)가 사유로 보여 주는 쿼리 이름 (payment-fail-page.tsx와 같은 값) */
const FAIL_MESSAGE_PARAM = 'message';
const MISSING_PAYMENT_MESSAGE = '결제 정보를 찾을 수 없어요.';
const ORDER_LIST_LINK_CLASS = 'text-note font-medium text-role-ink hover:underline';

/** 돈이 나가지 않고 끝난 결제 확인 오류 → 결제 실패 안내(U-07)에 서버 message를 사유로 보낸다 */
const PAYMENT_FAIL_CODES: readonly string[] = [
  'PAYMENT_CONFIRM_REJECTED',
  'PAYMENT_AMOUNT_MISMATCH',
  'STORE_CLOSED',
  'MENU_NOT_ON_SALE',
  'ORDER_INVALID_STATUS',
  'PAYMENT_INVALID_STATUS',
  'NOT_FOUND',
  'PAYMENT_NOT_FOUND',
  'VALIDATION_FAILED',
];
/** 결과를 모르는 오류 → 같은 paymentKey로 다시 시도 (서버 멱등) */
const RETRY_CODES: readonly string[] = ['PAYMENT_GATEWAY_ERROR', 'PAYMENT_KEY_MISMATCH'];

/**
 * 토스 successUrl 쿼리(paymentKey·amount)와 주문서가 붙여 둔 주문 ID를 결제 확인 요청으로 바꾼다.
 * @param searchParams - 현재 주소의 쿼리
 * @returns 결제 확인 요청, 값이 빠졌거나 숫자가 올바르지 않으면 null
 */
const parseConfirmRequest = (searchParams: URLSearchParams): ConfirmPaymentRequest | null => {
  const orderId = Number(searchParams.get(ORDER_ID_PARAM));
  const paymentKey = searchParams.get('paymentKey');
  const amount = Number(searchParams.get('amount'));
  if (!paymentKey || !Number.isInteger(orderId) || orderId <= 0 || !Number.isInteger(amount) || amount <= 0) {
    return null;
  }

  return { orderId, paymentKey, amount };
};

/**
 * 결제 실패 안내 경로를 만든다. 사유가 있으면 쿼리로 붙인다.
 * @param message - 실패 사유 (서버 message)
 * @returns 결제 실패 안내 경로
 */
const formatFailPath = (message: string): string =>
  `${PAYMENT_FAIL_PATH}?${new URLSearchParams({ [FAIL_MESSAGE_PARAM]: message }).toString()}`;

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
 * U-06 결제 승인 처리 화면. 토스 successUrl 쿼리로 주문의 결제를 확인(POST /orders/{orderId}/payment/confirm)하고 결과를 보여 준다.
 * 응답 시점에 주문은 이미 결제완료라, 주문 상세로 바로 갈 수 있다.
 * 확정 실패·금액 불일치·마감·품절·결제만료 주문 등 돈이 나가지 않은 오류는 결제 실패 안내(U-07)로 보내고,
 * 결과를 모르는 오류(502 PAYMENT_GATEWAY_ERROR·409 PAYMENT_KEY_MISMATCH)는 다시 시도 버튼으로 같은 요청을 보낸다.
 * @returns 결제 승인 처리 페이지
 */
export function PaymentSuccessPage(): ReactNode {
  const [searchParams] = useSearchParams();
  const confirmRequest = parseConfirmRequest(searchParams);
  const { data: order, error, isPending, isFetching, refetch } = useConfirmPayment(confirmRequest);

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

  if (order) return <PaymentResultCard order={order} />;

  if (isPending || isFetching) {
    return (
      <div className='flex items-center justify-center gap-2 px-4 py-10 text-note text-fg-muted'>
        <Spinner label='결제 확인 중' />
        결제를 확인하고 있어요.
      </div>
    );
  }

  const errorCode = getErrorCode(error);

  if (errorCode !== null && PAYMENT_FAIL_CODES.includes(errorCode)) {
    return (
      <Navigate
        to={formatFailPath(getErrorMessage(error))}
        replace
      />
    );
  }

  return (
    <div className='mx-auto max-w-[1100px] px-4 py-6'>
      <EmptyState
        message={getErrorMessage(error)}
        action={
          errorCode === null || RETRY_CODES.includes(errorCode) ? (
            <Button onClick={() => void refetch()}>다시 시도</Button>
          ) : (
            renderOrderListLink()
          )
        }
      />
    </div>
  );
}
