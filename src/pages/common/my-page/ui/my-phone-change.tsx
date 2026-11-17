import { useQueryClient } from '@tanstack/react-query';
import type { KeyboardEvent, ReactNode } from 'react';

import { CodeField, CodeRequestButton, PHONE_CODE_VALID_HINT, sessionKeys } from '@/entities/session';
import { Button } from '@/shared/ui/button';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Notice } from '@/shared/ui/notice';
import { Spinner } from '@/shared/ui/spinner';
import { useToast } from '@/shared/ui/toast';

import {
  PHONE_CHANGED_MESSAGE,
  PHONE_CHANGED_UNVERIFIED_MESSAGE,
  UNVERIFIED_PHONE_NOTICE,
  VERIFICATION_RELEASE_NOTICE,
} from '../config/phone-change';
import { usePhoneChange } from '../model/use-phone-change';

export interface MyPhoneChangeProps {
  /** 지금 번호가 인증돼 있는지 (인증 없이 바꾸면 해제된다고 알린다) */
  phoneVerified: boolean;
  /** 편집을 닫는다 ([취소] · 바꾼 뒤) */
  onClose: () => void;
}

const NEW_PHONE_ID = 'me-new-phone';

/**
 * 내 정보(C-06) 휴대폰 번호 변경 칸. 새 번호 → [인증번호 받기] → 인증번호 [확인]으로 인증된 번호로 바꾼다.
 * 서버 스위치가 꺼져 있으면 [인증 없이 바꾸기]로 미인증 번호로 바로 바꿀 수도 있다. 바꾸면 내 정보를 다시 불러온 뒤 닫는다.
 * @param props phoneVerified(지금 번호 인증 여부), onClose(편집 닫기)
 * @returns 번호 변경 요소
 */
export function MyPhoneChange({ phoneVerified, onClose }: MyPhoneChangeProps): ReactNode {
  const toast = useToast();
  const queryClient = useQueryClient();

  /**
   * 바꾼 결과를 알리고, 내 정보를 다시 불러온 뒤 편집을 닫는다.
   * @param isVerified - 인증하고 바꿨는지
   */
  const handleChanged = async (isVerified: boolean): Promise<void> => {
    toast(isVerified ? PHONE_CHANGED_MESSAGE : PHONE_CHANGED_UNVERIFIED_MESSAGE, 'success');
    await queryClient.invalidateQueries({ queryKey: sessionKeys.me() });
    onClose();
  };

  const { newPhone, phoneError, verifier, canSkipVerification, isUpdating, handlePhoneChange, handleUpdateClick } =
    usePhoneChange({ onChanged: handleChanged });

  /**
   * 새 번호 칸에서 엔터를 누르면 인증번호를 받는다.
   * @param event - 키보드 이벤트
   */
  const handlePhoneKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (verifier.resendSeconds === 0 && !verifier.isRequesting) void verifier.handleRequestClick();
  };

  return (
    <div className='flex flex-col gap-3'>
      <FormField
        id={NEW_PHONE_ID}
        label='새 휴대폰 번호'
        error={phoneError}
      >
        <div className='flex flex-col gap-2 tablet:flex-row'>
          <Input
            id={NEW_PHONE_ID}
            value={newPhone}
            onChange={(event) => handlePhoneChange(event.target.value)}
            onKeyDown={handlePhoneKeyDown}
            placeholder='010-0000-0000'
            autoComplete='tel'
            inputMode='tel'
            maxLength={13}
            disabled={isUpdating}
            aria-invalid={Boolean(phoneError)}
            aria-describedby={`${NEW_PHONE_ID}-message`}
          />
          <CodeRequestButton
            verifier={verifier}
            isVerified={false}
          />
        </div>
      </FormField>
      <CodeField
        verifier={verifier}
        id='me-new-phone-code'
        hint={PHONE_CODE_VALID_HINT}
      />
      {canSkipVerification ? (
        <Notice>
          {UNVERIFIED_PHONE_NOTICE}
          {phoneVerified ? (
            <>
              <br />
              {VERIFICATION_RELEASE_NOTICE}
            </>
          ) : null}
        </Notice>
      ) : null}
      <div className='flex flex-col-reverse gap-2 tablet:flex-row tablet:justify-end'>
        <Button
          variant='ghost'
          size='sm'
          disabled={isUpdating}
          onClick={onClose}
        >
          취소
        </Button>
        {canSkipVerification ? (
          <Button
            variant='secondary'
            size='sm'
            disabled={isUpdating || verifier.isConfirming}
            onClick={handleUpdateClick}
          >
            {isUpdating ? (
              <Spinner
                size={14}
                label='번호 바꾸는 중'
                className='border-current border-t-transparent'
              />
            ) : null}
            인증 없이 바꾸기
          </Button>
        ) : null}
      </div>
    </div>
  );
}
