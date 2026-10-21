import { useState, type ChangeEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Chip } from '@/shared/ui/chip';
import { Modal } from '@/shared/ui/modal';

/** 결제수단 선택지 — 토스 결제위젯 자리 (#25에서 renderPaymentMethods로 교체) */
const PAYMENT_METHOD_OPTIONS: string[] = [
  '퀵계좌이체',
  '신용·체크카드',
  '토스페이',
  '페이코',
  '카카오페이',
  '네이버페이',
];

export interface RequestPaymentModalProps {
  open: boolean;
  storeId: number | null;
  storeName: string;
  orderId: number;
  amount: number;
  onClose: () => void;
}

/**
 * U-05 결제 팝업. 가게명·주문번호·금액과 결제수단·약관 동의를 보여 주고 결제 또는 닫기로 이동한다. (목 데이터)
 * 결제하면 결제 완료로, 닫으면 결제창 닫힘 안내로 이동한다. 결제수단·약관 영역은 #25에서 토스 결제위젯으로 교체한다.
 * @param props open(열림 여부), storeId·storeName(가게), orderId(주문번호), amount(결제 금액), onClose(닫기)
 * @returns 결제 팝업 요소
 */
export function RequestPaymentModal({
  open,
  storeId,
  storeName,
  orderId,
  amount,
  onClose,
}: RequestPaymentModalProps): ReactNode {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>(PAYMENT_METHOD_OPTIONS[1]);
  const [isAgreed, setIsAgreed] = useState<boolean>(true);

  /**
   * 약관 동의 여부를 반영한다.
   * @param event 체크박스 변경 이벤트
   */
  const handleAgreementChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsAgreed(event.target.checked);
  };

  /**
   * 결제 완료 화면으로 이동한다. (승인 API 연동 전 임시)
   */
  const handlePayClick = (): void => {
    onClose();
    navigate('/payment/success');
  };

  /**
   * 결제 팝업을 닫고 결제창 닫힘 안내 화면으로 이동한다.
   */
  const handleCloseClick = (): void => {
    onClose();
    navigate(storeId === null ? '/payment/fail' : `/payment/fail?storeId=${storeId}`);
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseClick}
      closeOnOverlay={false}
      className='max-w-[560px]'
      title={`${storeName} · 주문번호 ${orderId}`}
    >
      <div className='flex flex-col gap-4'>
        <p className='text-title font-bold tabular-nums'>{formatPrice(amount)}</p>

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
                onClick={() => setSelectedMethod(option)}
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

        <Button
          size='lg'
          block
          disabled={!isAgreed}
          onClick={handlePayClick}
        >
          {formatPrice(amount)} 결제하기
        </Button>
      </div>
    </Modal>
  );
}
