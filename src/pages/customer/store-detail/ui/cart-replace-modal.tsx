import type { ReactNode } from 'react';

import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { Notice } from '@/shared/ui/notice';

export interface CartReplaceModalProps {
  open: boolean;
  isPending: boolean;
  /** 지금 담긴 가게 이름 (없으면 안내를 뺀다) */
  currentStoreName?: string | null;
  /** 지금 담긴 메뉴 종류 수 */
  currentItemCount?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 다른 가게 메뉴가 담겨 있을 때 비우고 담을지 묻는 확인 모달.
 * @param props open(열림 여부), isPending(요청 중), currentStoreName·currentItemCount(지금 담긴 가게), onConfirm(비우고 담기), onCancel(취소)
 * @returns 장바구니 교체 확인 모달 요소
 */
export function CartReplaceModal({
  open,
  isPending,
  currentStoreName,
  currentItemCount = 0,
  onConfirm,
  onCancel,
}: CartReplaceModalProps): ReactNode {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title='장바구니를 비울까요?'
      footer={
        <>
          <Button
            variant='secondary'
            size='lg'
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            size='lg'
            onClick={onConfirm}
            disabled={isPending}
          >
            비우고 담기
          </Button>
        </>
      }
    >
      <p className='text-fg-muted'>다른 가게 메뉴가 담겨 있어요. 비우고 담을까요?</p>
      {currentStoreName ? (
        <Notice tone='muted'>
          지금 담긴 가게 · {currentStoreName} (메뉴 {currentItemCount}개)
        </Notice>
      ) : null}
    </Modal>
  );
}
