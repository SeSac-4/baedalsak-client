import { useState, type ChangeEvent, type ReactNode } from 'react';

import { formatOrderItems, type OrderDetail } from '@/entities/order';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Chip } from '@/shared/ui/chip';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';

/** 조리 예상 시간 선택지 (분) */
const COOK_MINUTE_OPTIONS: number[] = [10, 15, 20, 30, 45, 60];

const DEFAULT_COOK_MINUTES = 20;

export interface AcceptOrderModalProps {
  /** 수락할 주문 (null이면 닫힘) */
  order: OrderDetail | null;
  onClose: () => void;
}

/**
 * O-02 주문 수락 모달. 조리 예상 시간을 칩 또는 직접 입력으로 고른다. (수락 확정은 API 연동 시 구현)
 * @param props order(수락할 주문), onClose(닫기)
 * @returns 주문 수락 모달 요소
 */
export function AcceptOrderModal({ order, onClose }: AcceptOrderModalProps): ReactNode {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(DEFAULT_COOK_MINUTES);
  const [customText, setCustomText] = useState<string>('');
  const minutes = customText ? Number(customText) : selectedMinutes;

  /**
   * 칩을 고르면 직접 입력값을 비운다.
   * @param option 고른 분
   */
  const handleChipClick = (option: number): void => {
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
          <Button>{minutes}분으로 수락</Button>
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
            <div className='flex flex-wrap gap-2'>
              {COOK_MINUTE_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  selected={!customText && selectedMinutes === option}
                  onClick={() => handleChipClick(option)}
                >
                  {option}분
                </Chip>
              ))}
            </div>
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
