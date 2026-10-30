import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { getSignupDonePath, SignupLoginLink, type SignupResponse } from '@/features/auth/signup';
import { AuthLayout } from '@/widgets/auth-layout';

import { SignupOwnerForm } from './signup-owner-form';

/**
 * C-04 사장님 가입 화면. 가입하면 서버가 로그인 쿠키를 주므로 바로 가게 등록(`/owner/store/new`)으로 이동한다.
 * @returns 사장님 가입 페이지
 */
export function SignupOwnerPage(): ReactNode {
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
      title='사장님 회원가입'
      footer={<SignupLoginLink />}
    >
      <SignupOwnerForm onSuccess={handleSignupSuccess} />
    </AuthLayout>
  );
}
