import { useEffect, type ReactNode } from 'react';

import { Card } from '@/shared/ui/card';
import { Spinner } from '@/shared/ui/spinner';

import { AGREEMENT_SELECTOR, PAYMENT_METHOD_SELECTOR, useTossPaymentWidget } from '../model/use-toss-payment-widget';

export interface TossPaymentCardProps {
  /** 결제 금액 (원) */
  amount: number;
  /** 결제할 수 있는 상태(렌더링 완료 + 필수 약관 동의)가 바뀔 때 호출 */
  onPayableChange: (isPayable: boolean) => void;
}

/**
 * U-05 토스 결제위젯 카드. 결제 UI와 약관 UI를 보여 준다. (테스트 환경)
 * @param props amount(결제 금액), onPayableChange(결제 가능 여부 변경)
 * @returns 결제위젯 카드 요소
 */
export function TossPaymentCard({ amount, onPayableChange }: TossPaymentCardProps): ReactNode {
  const { status, isAgreed } = useTossPaymentWidget(amount);
  const isPayable = status === 'ready' && isAgreed;

  useEffect(() => {
    onPayableChange(isPayable);
  }, [isPayable, onPayableChange]);

  return (
    <Card className='flex flex-col gap-2'>
      {status === 'loading' ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='결제 수단 불러오는 중' />
          결제 수단을 불러오고 있어요.
        </div>
      ) : null}
      {status === 'error' ? (
        <p className='py-10 text-center text-body text-fg-muted'>결제 수단을 불러오지 못했어요. 새로고침해 주세요.</p>
      ) : null}
      <div id={PAYMENT_METHOD_SELECTOR.slice(1)} />
      <div id={AGREEMENT_SELECTOR.slice(1)} />
    </Card>
  );
}
