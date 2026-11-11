import type { ReactNode } from 'react';

import { formatCountdown } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Spinner } from '@/shared/ui/spinner';

import type { PhoneCodeVerifier } from '../model/use-phone-code-verifier';

export interface PhoneCodeRequestButtonProps {
  verifier: PhoneCodeVerifier;
  /** 인증됨이면 버튼 대신 '인증됨' 배지를 보여 준다 */
  isVerified: boolean;
  /** 처음 버튼 문구 (기본 '인증번호 받기') */
  label?: string;
  /** 버튼 크기 (기본 md 44px, 목록 안에서는 sm 36px) */
  size?: 'sm' | 'md';
}

/**
 * 휴대폰 번호 옆 [인증번호 받기] 버튼. 보낸 뒤에는 60초 동안 '다시 받기 0:59'로 막고, 인증되면 '인증됨' 배지로 바뀐다.
 * @param props verifier(인증 상태), isVerified(인증됨 여부), label(처음 문구), size(버튼 크기)
 * @returns 버튼 또는 인증됨 배지
 */
export function PhoneCodeRequestButton({
  verifier,
  isVerified,
  label = '인증번호 받기',
  size = 'md',
}: PhoneCodeRequestButtonProps): ReactNode {
  const { isSent, isRequesting, resendSeconds, handleRequestClick } = verifier;

  if (isVerified) {
    return (
      <Badge
        tone='ok'
        className='h-8 shrink-0 self-center'
      >
        <Icon
          name='check'
          size={14}
          strokeWidth={2.4}
        />
        인증됨
      </Badge>
    );
  }

  const isWaiting = resendSeconds > 0;

  return (
    <Button
      type='button'
      variant='outline'
      size={size}
      className='shrink-0 px-3'
      disabled={isRequesting || isWaiting}
      onClick={handleRequestClick}
    >
      {isRequesting ? (
        <Spinner
          size={14}
          label='인증번호 보내는 중'
          className='border-current border-t-transparent'
        />
      ) : null}
      {isWaiting ? `다시 받기 ${formatCountdown(resendSeconds)}` : isSent ? '다시 받기' : label}
    </Button>
  );
}
