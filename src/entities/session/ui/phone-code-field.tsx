import type { KeyboardEvent, ReactNode } from 'react';

import { Button } from '@/shared/ui/button';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Notice } from '@/shared/ui/notice';
import { Spinner } from '@/shared/ui/spinner';

import { PHONE_CODE_VALID_HINT } from '../config/phone-verification';
import type { PhoneCodeVerifier } from '../model/use-phone-code-verifier';

export interface PhoneCodeFieldProps {
  verifier: PhoneCodeVerifier;
  /** 입력칸 id 앞부분 (예: 'customer' → customer-phone-code) */
  idPrefix: string;
}

/**
 * 인증번호 입력칸 + [확인] 버튼과 인증 안내 상자. 인증번호를 보낸 뒤에만 입력칸을 보여 준다.
 * 가입 폼 안에 들어가므로 form을 만들지 않고, 엔터는 가입 제출 대신 인증번호 확인으로 처리한다.
 * @param props verifier(인증 상태), idPrefix(입력칸 id 앞부분)
 * @returns 인증번호 입력 요소 (보여 줄 것이 없으면 null)
 */
export function PhoneCodeField({ verifier, idPrefix }: PhoneCodeFieldProps): ReactNode {
  const { isSent, code, codeError, notice, isConfirming, setCode, handleConfirmClick } = verifier;
  const codeId = `${idPrefix}-phone-code`;

  if (!isSent && !notice) return null;

  /**
   * 엔터를 누르면 바깥 폼을 제출하지 않고 인증번호를 확인한다.
   * @param event - 키보드 이벤트
   */
  const handleCodeKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    void handleConfirmClick();
  };

  return (
    <div className='flex flex-col gap-2'>
      {notice ? (
        <Notice
          tone='warn'
          role='alert'
        >
          {notice}
        </Notice>
      ) : null}
      {isSent ? (
        <FormField
          id={codeId}
          label='인증번호'
          hint={PHONE_CODE_VALID_HINT}
          error={codeError}
        >
          <div className='flex gap-2'>
            <Input
              id={codeId}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={handleCodeKeyDown}
              autoComplete='one-time-code'
              inputMode='numeric'
              maxLength={6}
              aria-invalid={Boolean(codeError)}
              aria-describedby={`${codeId}-message`}
            />
            <Button
              type='button'
              className='shrink-0 px-4'
              disabled={isConfirming}
              onClick={handleConfirmClick}
            >
              {isConfirming ? (
                <Spinner
                  size={14}
                  label='확인 중'
                  className='border-current border-t-transparent'
                />
              ) : null}
              확인
            </Button>
          </div>
        </FormField>
      ) : null}
    </div>
  );
}
