import { useState, type ReactNode } from 'react';

import type { MemberRole } from '@/entities/session';
import { Button } from '@/shared/ui/button';

import { MyPhoneChange } from './my-phone-change';
import { MyPhoneVerification } from './my-phone-verification';

export interface MyPhoneFieldProps {
  /** 내 휴대폰 번호 */
  phone: string;
  /** 서버 기준 인증 여부 (GET /members/me phoneVerified) */
  phoneVerified: boolean;
  /** 회원 유형 (휴대폰 인증 안내 문구가 역할마다 다르다) */
  role: MemberRole;
}

/**
 * 내 정보(C-06) 휴대폰 번호 칸. 평소에는 번호·인증 상태와 [번호 변경]을, 누르면 번호 변경 칸을 보여 준다.
 * 번호가 바뀌면 인증 칸을 새로 그려(key) 이전 번호의 인증 상태가 남지 않게 한다.
 * @param props phone(내 번호), phoneVerified(인증 여부), role(회원 유형)
 * @returns 휴대폰 번호 칸
 */
export function MyPhoneField({ phone, phoneVerified, role }: MyPhoneFieldProps): ReactNode {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (isEditing) {
    return (
      <div className='flex flex-col gap-3'>
        <span>{phone}</span>
        <MyPhoneChange
          phoneVerified={phoneVerified}
          onClose={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <MyPhoneVerification
      key={phone}
      phone={phone}
      phoneVerified={phoneVerified}
      role={role}
      action={
        <Button
          variant='ghost'
          size='sm'
          className='shrink-0 px-2'
          onClick={() => setIsEditing(true)}
        >
          번호 변경
        </Button>
      }
    />
  );
}
