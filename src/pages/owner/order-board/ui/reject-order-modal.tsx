import type { ReactNode } from 'react';

import { formatOrderItems, type OrderDetail } from '@/entities/order';
import { getErrorCode, getErrorMessage } from '@/shared/api';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { Notice } from '@/shared/ui/notice';
import { useToast } from '@/shared/ui/toast';

import { useRejectOrder } from '../model/use-reject-order';

const ORDER_INVALID_STATUS = 'ORDER_INVALID_STATUS';
const ALREADY_PROCESSED_MESSAGE = '이미 처리된 주문이에요. 목록을 새로 불러왔어요.';

export interface RejectOrderModalProps {
  /** 거절할 주문 */
  order: OrderDetail;
  onClose: () => void;
}

/**
 * 주문 거절 확인 모달. 되돌릴 수 없으므로 환불 안내를 보여 주고 확인을 받아 거절(POST /orders/{id}/reject)한다.
 * 이미 처리된 주문(409 ORDER_INVALID_STATUS)이면 안내하고 닫는다.
 * @param props order(거절할 주문), onClose(닫기)
 * @returns 주문 거절 모달 요소
 */
export function RejectOrderModal({ order, onClose }: RejectOrderModalProps): ReactNode {
  const toast = useToast();
  const { mutate: rejectOrder, isPending } = useRejectOrder();

  /** 주문을 거절한다. */
  const handleRejectClick = (): void => {
    rejectOrder(order.id, {
      onSuccess: (): void => {
        toast(`주문 #${order.id}을 거절했어요. 환불은 자동으로 진행돼요.`, 'success');
        onClose();
      },
      onError: (error: unknown): void => {
        if (getErrorCode(error) === ORDER_INVALID_STATUS) {
          toast(ALREADY_PROCESSED_MESSAGE);
          onClose();
          return;
        }
        toast(getErrorMessage(error));
      },
    });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`주문 #${order.id} 거절`}
      description={`${formatOrderItems(order.items)} · ${formatPrice(order.totalAmount)}`}
      footer={
        <>
          <Button
            variant='secondary'
            size='lg'
            onClick={onClose}
          >
            돌아가기
          </Button>
          <Button
            variant='danger'
            size='lg'
            disabled={isPending}
            onClick={handleRejectClick}
          >
            거절하기
          </Button>
        </>
      }
    >
      <Notice tone='warn'>
        <span>거절하면 되돌릴 수 없어요. 결제 금액은 고객에게 자동으로 환불돼요.</span>
      </Notice>
    </Modal>
  );
}
