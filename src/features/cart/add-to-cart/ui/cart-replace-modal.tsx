import type { ReactNode } from 'react';

import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

export interface CartReplaceModalProps {
  open: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 다른 가게 메뉴가 담겨 있을 때 비우고 담을지 묻는 확인 모달.
 * @param props open(열림 여부), isPending(요청 중), onConfirm(비우고 담기), onCancel(취소)
 * @returns 장바구니 교체 확인 모달 요소
 */
export function CartReplaceModal({ open, isPending, onConfirm, onCancel }: CartReplaceModalProps): ReactNode {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title='장바구니 교체'
      footer={
        <>
          <Button
            variant='secondary'
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
          >
            비우고 담기
          </Button>
        </>
      }
    >
      다른 가게 메뉴가 담겨 있어요. 장바구니를 비우고 이 메뉴를 담을까요?
    </Modal>
  );
}
