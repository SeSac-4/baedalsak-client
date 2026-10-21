import type { ReactNode } from 'react';

import type { Menu } from '@/entities/menu';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

export interface MenuRemoveModalProps {
  /** 삭제할 메뉴 (null이면 닫힘) */
  menu: Menu | null;
  onClose: () => void;
}

/**
 * 메뉴 삭제 확인 모달. (삭제는 API 연동 시 구현)
 * @param props menu(삭제할 메뉴), onClose(닫기)
 * @returns 삭제 확인 모달 요소
 */
export function MenuRemoveModal({ menu, onClose }: MenuRemoveModalProps): ReactNode {
  return (
    <Modal
      open={menu !== null}
      onClose={onClose}
      title='메뉴 삭제'
      footer={
        <>
          <Button
            variant='secondary'
            onClick={onClose}
          >
            취소
          </Button>
          <Button variant='danger'>삭제</Button>
        </>
      }
    >
      <p>
        <strong>{menu?.name}</strong> 메뉴를 삭제할까요?
      </p>
      <p className='mt-1 text-note text-fg-muted'>
        삭제한 메뉴는 고객 화면에서 사라지고, 지난 주문 내역에는 그대로 남아요.
      </p>
    </Modal>
  );
}
