import { useId, type FormEvent, type ReactNode } from 'react';

import type { Menu } from '@/entities/menu';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';
import { Textarea } from '@/shared/ui/textarea';

export interface MenuFormModalProps {
  open: boolean;
  /** 수정할 메뉴 (없으면 추가 모드) */
  menu: Menu | null;
  onClose: () => void;
}

const LABEL_CLASS = 'flex flex-col gap-1 text-note font-medium text-fg-muted';

/**
 * 제출 시 새로고침을 막는다. (API 연동 전 임시)
 * @param event 폼 제출 이벤트
 */
const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
  event.preventDefault();
};

/**
 * 메뉴 추가·수정 폼 모달. 이름·설명·가격을 입력한다. (저장은 API 연동 시 구현)
 * @param props open(열림 여부), menu(수정할 메뉴), onClose(닫기)
 * @returns 메뉴 폼 모달 요소
 */
export function MenuFormModal({ open, menu, onClose }: MenuFormModalProps): ReactNode {
  const formId = useId();
  const isEdit = menu !== null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? '메뉴 수정' : '메뉴 추가'}
      footer={
        <>
          <Button
            variant='secondary'
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            type='submit'
            form={formId}
          >
            {isEdit ? '저장' : '등록'}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        onSubmit={handleSubmit}
        className='flex flex-col gap-3'
      >
        <label className={LABEL_CLASS}>
          메뉴명
          <Input
            name='name'
            maxLength={100}
            defaultValue={menu?.name}
            required
          />
        </label>
        <label className={LABEL_CLASS}>
          설명
          <Textarea
            name='description'
            maxLength={500}
            defaultValue={menu?.description ?? undefined}
            placeholder='선택 입력'
          />
        </label>
        <label className={LABEL_CLASS}>
          가격
          <Input
            name='price'
            type='number'
            min={100}
            step={500}
            defaultValue={menu?.price}
            required
          />
        </label>
      </form>
    </Modal>
  );
}
