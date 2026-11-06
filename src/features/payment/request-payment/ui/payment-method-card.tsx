import { useId, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Card } from '@/shared/ui/card';
import { ChoiceButton, ChoiceGroup } from '@/shared/ui/choice';
import { Spinner } from '@/shared/ui/spinner';

import type { TossPaymentMethod, TossPaymentStatus } from '../model/use-toss-payment';
import { PaymentAgreement } from './payment-agreement';

/** 고를 수 있는 결제 수단과 안내 (계좌이체는 #98 결정으로 제외) */
const PAYMENT_METHODS: readonly { value: TossPaymentMethod; label: string; hint: string }[] = [
  { value: 'CARD', label: '신용·체크카드', hint: '카드사·간편결제는 결제창에서 골라요.' },
  { value: 'TOSSPAY', label: '토스페이', hint: '토스페이 결제창으로 바로 이동해요.' },
  { value: 'NAVERPAY', label: '네이버페이', hint: '네이버페이 결제창으로 바로 이동해요.' },
  { value: 'SAMSUNGPAY', label: '삼성페이', hint: '삼성페이 결제창으로 바로 이동해요.' },
  { value: 'SSG', label: 'SSG페이', hint: 'SSG페이 결제창으로 바로 이동해요.' },
];
/** 한 줄에 놓을 결제 수단 수 (토스 결제위젯과 같은 3열) */
const METHOD_COLUMNS = 3;

export interface PaymentMethodCardProps {
  /** 결제창 준비 상태 */
  status: TossPaymentStatus;
  /** 고른 결제 수단 */
  method: TossPaymentMethod;
  /** 결제 수단을 바꿀 때 */
  onMethodChange: (method: TossPaymentMethod) => void;
  /** 필수 약관에 모두 동의했는지 바뀔 때 (처음에는 동의 안 함) */
  onAgreedChange: (isAgreed: boolean) => void;
  /** 카드 위치·여백 조정 */
  className?: string;
  /** 결제 수단 아래에 붙일 안내 */
  children?: ReactNode;
}

/**
 * 결제 수단 카드. 신용·체크카드나 간편결제 하나를 고르고 필수 약관에 동의하면, 결제하기로 고른 수단의 토스 결제창이 열린다. (테스트 환경)
 * 토스 결제위젯이 그리던 결제 수단·약관 영역을 대신한다. 결제창을 준비하는 중·실패하면 안내를 보여 준다.
 * @param props status(준비 상태), method(고른 수단), onMethodChange(수단 변경), onAgreedChange(약관 동의 변경), className, children(아래 안내)
 * @returns 결제 수단 카드 요소
 */
export function PaymentMethodCard({
  status,
  method,
  onMethodChange,
  onAgreedChange,
  className,
  children,
}: PaymentMethodCardProps): ReactNode {
  const titleId = useId();
  const selected = PAYMENT_METHODS.find(({ value }) => value === method);

  return (
    <Card
      padding='none'
      className={cn('flex flex-col gap-3 p-5', className)}
    >
      <h2
        id={titleId}
        className='font-bold text-fg'
      >
        결제 수단
      </h2>
      {status === 'error' ? (
        <p className='py-6 text-center text-body text-fg-muted'>결제창을 준비하지 못했어요. 새로고침해 주세요.</p>
      ) : (
        <>
          <ChoiceGroup
            columns={METHOD_COLUMNS}
            aria-labelledby={titleId}
          >
            {PAYMENT_METHODS.map(({ value, label }) => (
              <ChoiceButton
                key={value}
                selected={value === method}
                disabled={status !== 'ready'}
                onClick={(): void => onMethodChange(value)}
              >
                {label}
              </ChoiceButton>
            ))}
          </ChoiceGroup>
          {status === 'loading' ? (
            <p className='flex items-center gap-2 text-note text-fg-muted'>
              <Spinner label='결제창 준비 중' />
              결제창을 준비하고 있어요.
            </p>
          ) : (
            <p className='text-note text-fg-muted'>{selected?.hint}</p>
          )}
          <PaymentAgreement onAgreedChange={onAgreedChange} />
        </>
      )}
      {children}
    </Card>
  );
}
