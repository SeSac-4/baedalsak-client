import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

import { getRoleHomePath } from '@/entities/session';
import { Notice } from '@/shared/ui/notice';
import { AuthLayout } from '@/widgets/auth-layout';

import type { LoginResponse } from '../api/login-api';
import { getLoginNotice } from '../lib/get-login-notice';
import { LoginForm } from './login-form';

const SIGNUP_PATH = '/signup';

/**
 * C-01 로그인 화면. 로그인하면 역할별 홈(고객 `/` · 사장님 `/owner/orders` · 라이더 `/rider`)으로 이동한다.
 * 사장님이 가게가 없으면 사장님 가드가 가게 등록으로 다시 보낸다.
 * 다른 화면이 router state로 안내(예: 비밀번호 재설정 완료)를 넘기면 폼 위에 보여 준다.
 * @returns 로그인 페이지
 */
export function LoginPage(): ReactNode {
  const navigate = useNavigate();
  const notice = getLoginNotice(useLocation().state);

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
      showLogo
      footer={
        <>
          <span>아직 회원이 아니세요?</span>
          <Link
            to={SIGNUP_PATH}
            className='rounded-control px-1 py-3 font-bold text-role underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink'
          >
            회원가입
          </Link>
        </>
      }
    >
      {notice ? (
        <Notice
          tone='role'
          role='status'
        >
          {notice}
        </Notice>
      ) : null}
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}
