import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { AuthLayout } from '@/widgets/auth-layout';

const LOGIN_PATH = '/login';

/**
 * 회원가입 역할 선택 화면. 가입 폼은 #42에서 붙이고, 지금은 로그인으로 돌아가는 링크만 둔다.
 * @returns 회원가입 페이지
 */
export function SignupRolePage(): ReactNode {
  return (
    <AuthLayout
      title='회원가입'
      footer={
        <>
          <span className='text-fg-muted'>이미 회원이세요?</span>
          <Link
            to={LOGIN_PATH}
            className='font-medium text-role underline-offset-2 hover:underline'
          >
            로그인
          </Link>
        </>
      }
    >
      <p className='text-fg-muted'>회원가입은 준비 중이에요.</p>
    </AuthLayout>
  );
}
