import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { getSignupDonePath, SignupLoginLink, type SignupResponse } from '@/features/auth/signup';
import { AuthLayout } from '@/widgets/auth-layout';

import { SignupCustomerForm } from './signup-customer-form';

/** 제목 위 '‹ 회원 유형 다시 고르기' (역할 선택으로) */
const SIGNUP_ROLE_BACK = { to: '/signup', label: '회원 유형 다시 고르기' };
/**
 * C-03 고객 가입 화면. 가입하면 서버가 로그인 쿠키를 주므로 바로 가게 목록(`/`)으로 이동한다.
 * @returns 고객 가입 페이지
 */
export function SignupCustomerPage(): ReactNode {
  const navigate = useNavigate();

  /**
   * 가입 성공 시 역할별 첫 화면으로 이동한다.
   * @param response - 가입 응답 (회원 ID·역할)
   */
  const handleSignupSuccess = ({ role }: SignupResponse): void => {
    navigate(getSignupDonePath(role), { replace: true });
  };

  return (
    <AuthLayout
      title='고객 회원가입'
      back={SIGNUP_ROLE_BACK}
      footer={<SignupLoginLink />}
    >
      <SignupCustomerForm onSuccess={handleSignupSuccess} />
    </AuthLayout>
  );
}
