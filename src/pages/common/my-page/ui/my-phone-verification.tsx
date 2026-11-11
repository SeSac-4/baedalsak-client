import { useQueryClient } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import {
  confirmMyPhoneCode,
  PHONE_VERIFICATION_HINT,
  PhoneCodeField,
  PhoneCodeRequestButton,
  requestMyPhoneCode,
  sessionKeys,
  usePhoneCodeVerifier,
} from '@/entities/session';
import { useToast } from '@/shared/ui/toast';

export interface MyPhoneVerificationProps {
  /** 내 휴대폰 번호 */
  phone: string;
  /** 서버 기준 인증 여부 (GET /members/me phoneVerified) */
  phoneVerified: boolean;
}

const VERIFIED_MESSAGE = '휴대폰 인증을 마쳤어요.';

/**
 * 내 정보(C-06) 휴대폰 번호 칸. 인증했으면 '인증됨' 배지, 안 했으면 [휴대폰 인증하기]와 안내 문구를 보여 준다.
 * 인증번호는 서버가 DB의 내 번호로 보내고, 성공하거나 이미 인증됨(409)이면 내 정보를 다시 불러온다.
 * @param props phone(내 번호), phoneVerified(인증 여부)
 * @returns 휴대폰 번호·인증 요소
 */
export function MyPhoneVerification({ phone, phoneVerified }: MyPhoneVerificationProps): ReactNode {
  const toast = useToast();
  const queryClient = useQueryClient();
  /** 다시 불러온 내 정보가 오기 전에도 바로 인증됨으로 보이도록 */
  const [isJustVerified, setIsJustVerified] = useState<boolean>(false);

  /** 내 정보를 다시 불러와 phoneVerified를 갱신한다 */
  const refreshMe = (): void => {
    void queryClient.invalidateQueries({ queryKey: sessionKeys.me() });
  };

  const verifier = usePhoneCodeVerifier<void>({
    requestCode: requestMyPhoneCode,
    confirmCode: (code: string) => confirmMyPhoneCode({ code }),
    onVerified: (): void => {
      setIsJustVerified(true);
      toast(VERIFIED_MESSAGE, 'success');
      refreshMe();
    },
    onAlreadyVerified: (): void => {
      setIsJustVerified(true);
      refreshMe();
    },
  });

  const isVerified = phoneVerified || isJustVerified;

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-wrap items-center gap-x-2 gap-y-1.5'>
        <span>{phone}</span>
        <PhoneCodeRequestButton
          verifier={verifier}
          isVerified={isVerified}
          label='휴대폰 인증하기'
          size='sm'
        />
      </div>
      {isVerified ? null : <p className='text-note leading-[1.45] text-fg-muted'>{PHONE_VERIFICATION_HINT}</p>}
      <PhoneCodeField
        verifier={verifier}
        idPrefix='me'
      />
    </div>
  );
}
