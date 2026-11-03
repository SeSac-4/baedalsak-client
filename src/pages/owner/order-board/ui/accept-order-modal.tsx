import { useState, type ChangeEvent, type ReactNode } from 'react';

import { formatOrderItems, type OrderDetail } from '@/entities/order';
import { getErrorCode, getErrorMessage } from '@/shared/api';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { ChoiceButton, ChoiceGroup } from '@/shared/ui/choice';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';
import { useToast } from '@/shared/ui/toast';

import { useAcceptOrder } from '../model/use-accept-order';

/** 조리 예상 시간 선택지 (분) */
const COOK_MINUTE_OPTIONS: number[] = [10, 15, 20, 30, 45, 60];

const DEFAULT_COOK_MINUTES = 20;
const ORDER_INVALID_STATUS = 'ORDER_INVALID_STATUS';
const ALREADY_PROCESSED_MESSAGE = '이미 처리된 주문이에요. 목록을 새로 불러왔어요.';

export interface AcceptOrderModalProps {
  /** 수락할 주문 (null이면 닫힘) */
  order: OrderDetail | null;
  onClose: () => void;
  /** 수락에 성공했을 때 (진행 중 탭으로 이동 등) */
  onAccepted: () => void;
}

/**
 * O-02 주문 수락 모달. 조리 예상 시간을 칩 또는 직접 입력으로 골라 수락(POST /orders/{id}/accept)한다.
 * 이미 처리된 주문(409 ORDER_INVALID_STATUS)이면 안내하고 닫는다. 목록은 성공·실패와 관계없이 다시 받는다.
 * @param props order(수락할 주문), onClose(닫기), onAccepted(수락 성공)
 * @returns 주문 수락 모달 요소
 */
export function AcceptOrderModal({ order, onClose, onAccepted }: AcceptOrderModalProps): ReactNode {
  const toast = useToast();
  const { mutate: acceptOrder, isPending } = useAcceptOrder();
  const [selectedMinutes, setSelectedMinutes] = useState<number>(DEFAULT_COOK_MINUTES);
  const [customText, setCustomText] = useState<string>('');
  const minutes = customText ? Number(customText) : selectedMinutes;
  const isValidMinutes = Number.isInteger(minutes) && minutes >= 1;

  /** 고른 조리 예상 시간으로 수락한다. */
  const handleAcceptClick = (): void => {
    if (!order || !isValidMinutes) return;
    acceptOrder(
      { orderId: order.id, estimatedMinutes: minutes },
      {
        onSuccess: (): void => {
          toast(`주문 #${order.id}을 수락했어요. 조리를 시작하세요.`);
          onAccepted();
        },
        onError: (error: unknown): void => {
          if (getErrorCode(error) === ORDER_INVALID_STATUS) {
            toast(ALREADY_PROCESSED_MESSAGE);
            onClose();
            return;
          }
          toast(getErrorMessage(error));
        },
      },
    );
  };

  /**
   * 칩을 고르면 직접 입력값을 비운다.
   * @param option 고른 분
   */
  const handleMinuteClick = (option: number): void => {
    setSelectedMinutes(option);
    setCustomText('');
  };

  /**
   * 직접 입력한 분을 반영한다.
   * @param event 입력 변경 이벤트
   */
  const handleCustomChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCustomText(event.target.value);
  };

  return (
    <Modal
      open={order !== null}
      onClose={onClose}
      title={order ? `주문 #${order.id} 수락` : undefined}
      footer={
        <>
          <Button
            variant='secondary'
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            disabled={!isValidMinutes || isPending}
            onClick={handleAcceptClick}
          >
            {isValidMinutes ? `${minutes}분으로 수락` : '조리 시간을 입력해 주세요'}
          </Button>
        </>
      }
    >
      {order ? (
        <div className='flex flex-col gap-4'>
          <p className='text-note text-fg-muted'>
            {formatOrderItems(order.items)} · {formatPrice(order.totalAmount)}
          </p>
          <fieldset className='flex flex-col gap-2'>
            <legend className='mb-2 text-note font-medium text-fg-muted'>조리 예상 시간</legend>
            <ChoiceGroup aria-label='조리 예상 시간'>
              {COOK_MINUTE_OPTIONS.map((option) => (
                <ChoiceButton
                  key={option}
                  selected={!customText && selectedMinutes === option}
                  onClick={() => handleMinuteClick(option)}
                >
                  {option}분
                </ChoiceButton>
              ))}
            </ChoiceGroup>
            <label className='flex items-center gap-2 text-note text-fg-muted'>
              직접 입력
              <Input
                type='number'
                min={1}
                max={180}
                value={customText}
                placeholder='분'
                onChange={handleCustomChange}
                className='w-24'
              />
              분
            </label>
          </fieldset>
          <p className='text-note text-fg-subtle'>수락하면 바로 조리중으로 바뀌고 배달 요청이 만들어져요.</p>
        </div>
      ) : null}
    </Modal>
  );
}
