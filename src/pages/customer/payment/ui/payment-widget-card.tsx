import type { ChangeEvent, ReactNode } from 'react';

import { Card } from '@/shared/ui/card';
import { Chip } from '@/shared/ui/chip';

/** 결제수단 선택지 — 토스 결제위젯 자리 (#25에서 renderPaymentMethods로 교체) */
const PAYMENT_METHOD_OPTIONS: string[] = [
  '퀵계좌이체',
  '신용·체크카드',
  '토스페이',
  '페이코',
  '카카오페이',
  '네이버페이',
];

export interface PaymentWidgetCardProps {
  selectedMethod: string;
  isAgreed: boolean;
  onMethodChange: (method: string) => void;
  onAgreementChange: (isAgreed: boolean) => void;
}

/**
 * U-05 결제위젯 영역. 결제 방법과 약관 동의를 보여 준다. (목업, #25에서 토스 결제위젯으로 교체)
 * @param props selectedMethod(고른 결제수단), isAgreed(약관 동의 여부), onMethodChange·onAgreementChange(변경 처리)
 * @returns 결제위젯 영역 요소
 */
export function PaymentWidgetCard({
  selectedMethod,
  isAgreed,
  onMethodChange,
  onAgreementChange,
}: PaymentWidgetCardProps): ReactNode {
  /**
   * 약관 동의 여부를 알린다.
   * @param event 체크박스 변경 이벤트
   */
  const handleAgreementChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onAgreementChange(event.target.checked);
  };

  return (
    <Card className='flex flex-col gap-4'>
      <p className='rounded-lg bg-warn-soft px-3 py-2 text-note font-medium text-warn'>
        테스트 환경이에요. 실제로 결제되지 않아요.
      </p>

      <fieldset>
        <legend className='mb-2 text-body font-bold text-fg'>결제 방법</legend>
        <div className='grid grid-cols-3 gap-2'>
          {PAYMENT_METHOD_OPTIONS.map((option, index) => (
            <Chip
              key={option}
              selected={selectedMethod === option}
              onClick={() => onMethodChange(option)}
              className={index === 0 ? 'col-span-3 h-12 justify-center rounded-lg' : 'h-12 justify-center rounded-lg'}
            >
              {option}
            </Chip>
          ))}
        </div>
      </fieldset>

      <label className='flex items-center gap-2 text-note text-fg-muted'>
        <input
          type='checkbox'
          checked={isAgreed}
          onChange={handleAgreementChange}
          className='size-4 accent-role'
        />
        [필수] 결제 서비스 이용 약관, 개인정보 처리 동의
      </label>
    </Card>
  );
}
