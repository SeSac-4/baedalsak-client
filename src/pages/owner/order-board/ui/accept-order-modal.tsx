import { useId, useState, type ChangeEvent, type ReactNode } from 'react';

import { formatOrderItems, type OrderDetail } from '@/entities/order';
import { getErrorCode, getErrorMessage } from '@/shared/api';
import { formatPrice, formatTime } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { ChoiceButton, ChoiceGroup } from '@/shared/ui/choice';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';
import { Notice } from '@/shared/ui/notice';
import { useToast } from '@/shared/ui/toast';

import { useAcceptOrder } from '../model/use-accept-order';

/** 조리 예상 시간 선택지 (분) */
const COOK_MINUTE_OPTIONS: number[] = [10, 15, 20, 30, 45, 60];

const DEFAULT_COOK_MINUTES = 20;
const MIN_COOK_MINUTES = 5;
const MAX_COOK_MINUTES = 120;
const MINUTE_IN_MS = 60_000;
const ORDER_INVALID_STATUS = 'ORDER_INVALID_STATUS';
const ALREADY_PROCESSED_MESSAGE = '이미 처리된 주문이에요. 목록을 새로 불러왔어요.';

export interface AcceptOrderModalProps {
  /** 수락할 주문 */
  order: OrderDetail;
  onClose: () => void;
  /** 수락에 성공했을 때 (진행 중 탭으로 이동 등) */
  onAccepted: () => void;
}

/**
 * O-02 주문 수락 모달. 조리 예상 시간을 선택 또는 직접 입력(5~120분)으로 골라 수락(POST /orders/{id}/accept)한다.
 * 열 때마다 새로 그려 선택을 초기화한다. 이미 처리된 주문(409 ORDER_INVALID_STATUS)이면 안내하고 닫는다.
 * @param props order(수락할 주문), onClose(닫기), onAccepted(수락 성공)
 * @returns 주문 수락 모달 요소
 */
export function AcceptOrderModal({ order, onClose, onAccepted }: AcceptOrderModalProps): ReactNode {
  const id = useId();
  const toast = useToast();
  const { mutate: acceptOrder, isPending } = useAcceptOrder();
  const [selectedMinutes, setSelectedMinutes] = useState<number>(DEFAULT_COOK_MINUTES);
  const [customText, setCustomText] = useState<string>('');
  const [openedAt] = useState<number>(() => Date.now());
  const minutes = customText ? Number(customText) : selectedMinutes;
  const isValidMinutes = minutes >= MIN_COOK_MINUTES && minutes <= MAX_COOK_MINUTES;

  /** 고른 조리 예상 시간으로 수락한다. */
  const handleAcceptClick = (): void => {
    if (!isValidMinutes) return;
    acceptOrder(
      { orderId: order.id, estimatedMinutes: minutes },
      {
        onSuccess: (): void => {
          toast(`주문 #${order.id}을 수락했어요. 조리를 시작하세요.`, 'success');
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
   * 시간을 고르면 직접 입력값을 비운다.
   * @param option 고른 분
   */
  const handleMinuteClick = (option: number): void => {
    setSelectedMinutes(option);
    setCustomText('');
  };

  /**
   * 직접 입력한 분을 숫자만 남겨 반영한다.
   * @param event 입력 변경 이벤트
   */
  const handleCustomChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCustomText(event.target.value.replace(/\D/g, ''));
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`주문 #${order.id} 수락`}
      description={`${formatOrderItems(order.items)} · ${formatPrice(order.totalAmount)}`}
      footer={
        <Button
          size='lg'
          disabled={!isValidMinutes || isPending}
          onClick={handleAcceptClick}
        >
          {isValidMinutes ? `${minutes}분으로 수락` : `${MIN_COOK_MINUTES}~${MAX_COOK_MINUTES}분으로 입력해 주세요`}
        </Button>
      }
    >
      <div className='flex flex-col gap-2'>
        <span
          id={`${id}-label`}
          className='font-semibold text-fg'
        >
          조리 예상 시간
        </span>
        <ChoiceGroup aria-labelledby={`${id}-label`}>
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
        <div className='mt-1 flex items-center gap-2'>
          <label
            htmlFor={`${id}-custom`}
            className='flex-none text-note text-fg-muted'
          >
            직접 입력
          </label>
          <Input
            id={`${id}-custom`}
            inputMode='numeric'
            suffix='분'
            placeholder={`${MIN_COOK_MINUTES}~${MAX_COOK_MINUTES}`}
            value={customText}
            aria-invalid={!isValidMinutes}
            onChange={handleCustomChange}
            className='text-right tabular-nums'
          />
        </div>
      </div>
      <Notice tone='muted'>
        <span>
          수락하면 바로 조리중이 되고 배달 요청이 자동으로 만들어져요.
          {isValidMinutes
            ? ` 조리 완료 예상 ${formatTime(new Date(openedAt + minutes * MINUTE_IN_MS).toISOString())}`
            : null}
        </span>
      </Notice>
    </Modal>
  );
}
