import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import type { PaymentReady } from '@/entities/payment';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { useToast } from '@/shared/ui/toast';

import { useTossPaymentWidget } from '../model/use-toss-payment-widget';
import { TossPaymentCard } from './toss-payment-card';

const PAYMENT_REQUEST_ERROR_MESSAGE = '결제창을 열지 못했어요. 다시 시도해 주세요.';
/** PC에서 구매자가 토스 결제창을 닫으면 failUrl 대신 이 코드의 오류로 끝난다 */
const USER_CANCEL_CODE = 'USER_CANCEL';
const PAYMENT_FAIL_PATH = '/payment/fail';
/** 승인이 이미 끝난 경우(409) 결제 완료 화면이 주문 상세로 보낼 주문 ID 쿼리 이름 (payment-success-page.tsx와 같은 값) */
const ORDER_ID_PARAM = 'order';

/**
 * 구매자가 결제창을 닫아 생긴 오류인지 확인한다.
 * @param error 결제창 요청 오류
 * @returns 결제창 닫기 여부
 */
const isUserCancelError = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === USER_CANCEL_CODE;

export interface PaymentFormProps {
  /** 결제할 주문 ID */
  orderId: number;
  /** 결제 요청 API 응답 */
  paymentReady: PaymentReady;
}

/**
 * U-05 결제 폼. 토스 결제위젯과 주문명·결제 금액을 보여 주고, 결제하기를 누르면 토스 결제창을 띄운다.
 * 결제 결과는 토스가 successUrl(/payment/success)·failUrl(/payment/fail)로 이동시켜 전달한다.
 * @param props orderId(주문 ID), paymentReady(결제 요청 정보)
 * @returns 결제 폼 요소
 */
export function PaymentForm({ orderId, paymentReady }: PaymentFormProps): ReactNode {
  const navigate = useNavigate();
  const toast = useToast();
  const { status, isAgreed, requestPayment } = useTossPaymentWidget(paymentReady.amount);
  const isPayable = status === 'ready' && isAgreed;

  /**
   * 토스 결제창을 띄운다. 결제창을 닫으면 결제 실패 안내(U-07)로 이동하고,
   * 결제창을 열지 못하면(테스트 미지원 결제수단 등) 토스트로 알린다.
   */
  const handlePayClick = async (): Promise<void> => {
    try {
      await requestPayment({
        orderId: paymentReady.tossOrderId,
        orderName: paymentReady.orderName,
        successUrl: `${window.location.origin}/payment/success?${ORDER_ID_PARAM}=${orderId}`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error: unknown) {
      if (isUserCancelError(error)) {
        navigate(PAYMENT_FAIL_PATH);
        return;
      }
      toast(error instanceof Error && error.message ? error.message : PAYMENT_REQUEST_ERROR_MESSAGE);
    }
  };

  return (
    <div className='grid gap-4 tablet:grid-cols-[1fr_300px] tablet:items-start'>
      <TossPaymentCard status={status} />

      <aside className='tablet:sticky tablet:top-4'>
        <Card className='flex flex-col gap-2'>
          <strong className='text-body text-fg'>{paymentReady.orderName}</strong>
          <p className='text-note text-fg-muted tabular-nums'>주문번호 {orderId}</p>
          <div className='flex justify-between border-t border-border pt-2 text-body font-bold tabular-nums'>
            <span className='text-fg'>결제 금액</span>
            <span className='text-fg'>{formatPrice(paymentReady.amount)}</span>
          </div>
          <Button
            size='lg'
            block
            disabled={!isPayable}
            onClick={handlePayClick}
          >
            {formatPrice(paymentReady.amount)} 결제하기
          </Button>
        </Card>
      </aside>
    </div>
  );
}
