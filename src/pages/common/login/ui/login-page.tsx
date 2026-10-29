import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';

import { getRoleHomePath } from '@/entities/session';
import { AuthLayout } from '@/widgets/auth-layout';

import type { LoginResponse } from '../api/login-api';
import { LoginForm } from './login-form';

const SIGNUP_PATH = '/signup';

/**
 * C-01 로그인 화면. 로그인하면 역할별 홈(고객 `/` · 사장님 `/owner/orders` · 라이더 `/rider`)으로 이동한다.
 * 사장님이 가게가 없으면 사장님 가드가 가게 등록으로 다시 보낸다.
 * @returns 로그인 페이지
 */
export function LoginPage(): ReactNode {
  const navigate = useNavigate();

  /**
   * 로그인 성공 시 역할 홈으로 이동한다.
   * @param response - 로그인 응답 (회원 ID·역할)
   */
  const handleLoginSuccess = ({ role }: LoginResponse): void => {
    navigate(getRoleHomePath(role), { replace: true });
  };

  return (
    <AuthLayout
      title='로그인'
      footer={
        <>
          <span className='text-fg-muted'>아직 회원이 아니세요?</span>
          <Link
            to={SIGNUP_PATH}
            className='font-medium text-role underline-offset-2 hover:underline'
          >
            회원가입
          </Link>
        </>
      }
    >
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}
