import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { MEMBER_ROLE_LABEL, type MemberRole } from '@/entities/session';
import { SignupLoginLink } from '@/features/auth/signup';
import { Card } from '@/shared/ui/card';
import { AuthLayout } from '@/widgets/auth-layout';

interface SignupRoleOption {
  role: MemberRole;
  path: string;
  description: string;
}

/** 가입 역할 카드 (화면 표시 순서) */
const SIGNUP_ROLE_OPTIONS: readonly SignupRoleOption[] = [
  { role: 'CUSTOMER', path: '/signup/customer', description: '우리 동네 가게에서 음식을 주문해요.' },
  { role: 'OWNER', path: '/signup/owner', description: '가게를 등록하고 주문을 받아요.' },
  { role: 'RIDER', path: '/signup/rider', description: '주문을 픽업해 고객에게 배달해요.' },
];

/**
 * C-02 회원가입 역할 선택 화면. 고객·사장님·라이더 카드 중 하나를 골라 역할별 가입 화면으로 간다.
 * @returns 역할 선택 페이지
 */
export function SignupRolePage(): ReactNode {
  return (
    <AuthLayout
      title='회원가입'
      footer={<SignupLoginLink />}
    >
      <p className='text-note text-fg-muted'>어떤 회원으로 가입할지 골라 주세요.</p>
      <ul className='flex flex-col gap-2'>
        {SIGNUP_ROLE_OPTIONS.map(({ role, path, description }) => (
          <li key={role}>
            <Link
              to={path}
              className='block rounded-xl focus-visible:ring-2 focus-visible:ring-role/50 focus-visible:outline-none'
            >
              <Card
                interactive
                className='flex flex-col gap-0.5'
              >
                <span className='text-body font-bold text-fg'>{MEMBER_ROLE_LABEL[role]}</span>
                <span className='text-note text-fg-muted'>{description}</span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </AuthLayout>
  );
}
