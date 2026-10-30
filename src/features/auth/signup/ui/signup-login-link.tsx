import type { ReactNode } from 'react';
import { Link } from 'react-router';

const LOGIN_PATH = '/login';

/**
 * 가입 화면 하단 "이미 계정이 있나요? 로그인" 링크 (AuthLayout footer).
 * @returns 로그인 전환 링크 요소
 */
export function SignupLoginLink(): ReactNode {
  return (
    <>
      <span className='text-fg-muted'>이미 계정이 있나요?</span>
      <Link
        to={LOGIN_PATH}
        className='font-medium text-role underline-offset-2 hover:underline'
      >
        로그인
      </Link>
    </>
  );
}
