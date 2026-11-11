import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { AuthLayout } from '@/widgets/auth-layout';

import { PasswordForgotForm } from './password-forgot-form';
import { PasswordResetForm } from './password-reset-form';

/** 1단계 이메일 입력 · 2단계 코드·새 비밀번호 입력 */
type PasswordResetStep = 'email' | 'reset';

const LOGIN_PATH = '/login';
const LOGIN_BACK = { to: LOGIN_PATH, label: '로그인으로 돌아가기' };
/** 로그인 화면 상단에 보여 줄 안내 (router state로 넘긴다) */
const RESET_DONE_NOTICE = '비밀번호를 바꿨어요. 새 비밀번호로 로그인해 주세요.';

/**
 * 비밀번호 찾기·재설정 화면 (C-01에서 진입). 이메일로 받은 인증 코드로 새 비밀번호를 설정한다.
 * 이메일은 개인정보라 URL 쿼리에 넣지 않고 이 화면의 상태로만 두고, 새로고침하면 1단계부터 다시 한다.
 * @returns 비밀번호 재설정 페이지
 */
export function PasswordResetPage(): ReactNode {
  const navigate = useNavigate();
  const [step, setStep] = useState<PasswordResetStep>('email');
  const [email, setEmail] = useState<string>('');

  /**
   * 메일 요청에 성공하면 이메일을 기억하고 2단계로 넘어간다.
   * @param sentEmail - 인증 코드를 보낸 이메일
   */
  const handleCodeSent = (sentEmail: string): void => {
    setEmail(sentEmail);
    setStep('reset');
  };

  /**
   * 비밀번호를 바꾸면 로그인 화면으로 보내고 새 비밀번호로 로그인하라고 안내한다.
   */
  const handleResetSuccess = (): void => {
    navigate(LOGIN_PATH, { replace: true, state: { notice: RESET_DONE_NOTICE } });
  };

  return (
    <AuthLayout
      title={step === 'email' ? '비밀번호 찾기' : '새 비밀번호 설정'}
      back={LOGIN_BACK}
    >
      {step === 'email' ? (
        <PasswordForgotForm
          defaultEmail={email}
          onSuccess={handleCodeSent}
        />
      ) : (
        <PasswordResetForm
          email={email}
          onChangeEmail={() => setStep('email')}
          onSuccess={handleResetSuccess}
        />
      )}
    </AuthLayout>
  );
}
