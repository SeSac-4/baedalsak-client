import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { Notice } from '@/shared/ui/notice';
import { Spinner } from '@/shared/ui/spinner';
import { useToast } from '@/shared/ui/toast';

import { WITHDRAW_DONE_NOTICE } from '../config/withdraw';
import { parseWithdrawError } from '../lib/parse-withdraw-error';
import { useRemoveMember } from '../model/use-remove-member';

export interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
}

const LOGIN_PATH = '/login';

/**
 * 회원 탈퇴 확인 창. [탈퇴하기]를 누르면 탈퇴하고 로그인 화면으로 보내 완료 토스트를 띄운다.
 * 요청 중에는 버튼·닫기를 잠그고, 403은 서버 문구를 안내 상자에, 503 등은 토스트로 보여 주며 창을 그대로 둔다.
 * @param props open(열림), onClose(닫기)
 * @returns 탈퇴 확인 모달 요소
 */
export function WithdrawModal({ open, onClose }: WithdrawModalProps): ReactNode {
  const navigate = useNavigate();
  const toast = useToast();
  const [notAllowedMessage, setNotAllowedMessage] = useState<string | null>(null);

  const { mutate: removeMember, isPending } = useRemoveMember();

  /** 요청 중이 아니면 안내를 지우고 닫는다 */
  const handleClose = (): void => {
    if (isPending) return;
    setNotAllowedMessage(null);
    onClose();
  };

  /**
   * 탈퇴 실패를 보여 준다. 이미 탈퇴(404)는 로그아웃처럼 로그인 화면으로, 401은 공용 처리(세션 정리 · AuthGuard)에 맡긴다.
   * @param error - 탈퇴 요청 에러
   */
  const handleWithdrawError = (error: unknown): void => {
    const parsed = parseWithdrawError(error);
    if (parsed.type === 'not-allowed') {
      setNotAllowedMessage(parsed.message);
      return;
    }
    if (parsed.type === 'already-withdrawn') {
      void navigate(LOGIN_PATH, { replace: true });
      return;
    }
    if (parsed.type === 'toast') toast(parsed.message);
  };

  /**
   * 탈퇴하고 성공하면 완료 토스트를 띄우고 로그인 화면으로 간다.
   * 안내를 router state로 넘기면 세션 정리로 AuthGuard가 먼저 state 없이 이동시켜 사라지므로, 화면을 옮겨도 남는 토스트를 쓴다.
   */
  const handleWithdrawClick = (): void => {
    setNotAllowedMessage(null);
    removeMember(undefined, {
      onSuccess: (): void => {
        toast(WITHDRAW_DONE_NOTICE, 'success');
        void navigate(LOGIN_PATH, { replace: true });
      },
      onError: handleWithdrawError,
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeOnOverlay={!isPending}
      title='회원 탈퇴할까요?'
      footer={
        <>
          <Button
            variant='secondary'
            size='lg'
            disabled={isPending}
            onClick={handleClose}
          >
            취소
          </Button>
          <Button
            variant='danger'
            size='lg'
            disabled={isPending || notAllowedMessage !== null}
            onClick={handleWithdrawClick}
          >
            {isPending ? (
              <Spinner
                size={14}
                label='탈퇴하는 중'
                className='border-current border-t-transparent'
              />
            ) : null}
            탈퇴하기
          </Button>
        </>
      }
    >
      <p className='text-fg-muted'>
        탈퇴하면 되돌릴 수 없어요. 주문 내역은 남지만 이 계정으로 다시 로그인할 수 없어요.
      </p>
      {notAllowedMessage ? (
        <Notice
          tone='warn'
          role='alert'
        >
          {notAllowedMessage}
        </Notice>
      ) : null}
    </Modal>
  );
}
