import { useId, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import type { StoreDetail } from '@/entities/store';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';
import { Notice } from '@/shared/ui/notice';
import { useToast } from '@/shared/ui/toast';

import { useRemoveStore } from '../model/use-remove-store';

const STORE_CREATE_PATH = '/owner/store/new';
const CLOSED_MESSAGE = '가게를 폐업했어요.';

export interface StoreCloseModalProps {
  store: StoreDetail;
  onClose: () => void;
}

/**
 * 가게 폐업 확인 모달. 되돌릴 수 없으므로 가게 이름을 똑같이 입력해야 폐업할 수 있다.
 * 실패하면(예: 409 진행 중 주문) 서버 메시지를 모달 안에 보여 주고, 성공하면 가게 등록 화면으로 보낸다.
 * @param props store(내 가게), onClose(닫기)
 * @returns 가게 폐업 모달 요소
 */
export function StoreCloseModal({ store, onClose }: StoreCloseModalProps): ReactNode {
  const navigate = useNavigate();
  const toast = useToast();
  const inputId = useId();
  const [confirmName, setConfirmName] = useState<string>('');
  const { mutateAsync: removeStore, isPending, error, reset } = useRemoveStore(store.id);
  const isNameMatched = confirmName.trim() === store.name;

  /**
   * 확인용 가게 이름을 바꾸고, 앞서 보인 실패 안내를 지운다.
   * @param value - 입력한 가게 이름
   */
  const handleNameChange = (value: string): void => {
    setConfirmName(value);
    if (error) reset();
  };

  /** 가게를 폐업하고 가게 등록 화면으로 간다. 실패하면 모달에 안내가 남는다. */
  const handleCloseStoreClick = async (): Promise<void> => {
    try {
      await removeStore();
    } catch {
      return;
    }
    toast(CLOSED_MESSAGE, 'success');
    navigate(STORE_CREATE_PATH, { replace: true });
  };

  return (
    <Modal
      open
      onClose={onClose}
      closeOnOverlay={!isPending}
      title='가게를 폐업할까요?'
      description={store.name}
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
            disabled={!isNameMatched || isPending}
            onClick={() => void handleCloseStoreClick()}
          >
            폐업하기
          </Button>
        </>
      }
    >
      <div className='flex flex-col gap-3'>
        <Notice tone='warn'>
          <span>폐업하면 가게와 메뉴가 고객에게 더 이상 보이지 않고, 되돌릴 수 없어요.</span>
        </Notice>
        <ul className='flex list-disc flex-col gap-1 pl-5 text-note text-fg-muted'>
          <li>진행 중인 주문이 있으면 폐업할 수 없어요.</li>
          <li>폐업 후 새 가게를 다시 등록할 수 있어요.</li>
        </ul>
        <FormField
          id={inputId}
          label='확인을 위해 가게 이름을 입력해 주세요'
          hint={`'${store.name}'을(를) 똑같이 입력하면 폐업할 수 있어요.`}
        >
          <Input
            id={inputId}
            value={confirmName}
            autoComplete='off'
            placeholder={store.name}
            aria-describedby={`${inputId}-message`}
            onChange={(event) => handleNameChange(event.target.value)}
          />
        </FormField>
        {error ? (
          <Notice
            tone='warn'
            role='alert'
          >
            {getErrorMessage(error)}
          </Notice>
        ) : null}
      </div>
    </Modal>
  );
}
