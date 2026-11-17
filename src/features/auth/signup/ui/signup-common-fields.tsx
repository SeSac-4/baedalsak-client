import type { ChangeEvent, ReactNode } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import {
  CodeField,
  CodeRequestButton,
  EMAIL_CODE_VALID_HINT,
  EMAIL_VERIFICATION_HINT,
  getPhoneVerificationHint,
  PASSWORD_HINT,
  PHONE_CODE_VALID_HINT,
  type MemberRole,
} from '@/entities/session';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/password-input';

import type { SignupCommonValues } from '../model/signup-schema';
import type { SignupCodeVerification } from '../model/use-signup-code-verification';

export interface SignupCommonFieldsProps {
  /** 입력칸 id 앞부분 (예: 'customer' → customer-email) */
  idPrefix: string;
  /** 가입하는 회원 유형 (휴대폰 칸 안내 문구가 역할마다 다르다) */
  role: MemberRole;
  /** 가입 폼의 register (역할별 폼 값은 공통 필드를 포함한다) */
  register: UseFormRegister<SignupCommonValues>;
  /** 가입 폼의 필드 에러 */
  errors: FieldErrors<SignupCommonValues>;
  /** 이메일 인증 상태 (useSignupEmailVerification, 필수) */
  emailVerification: SignupCodeVerification;
  /** 휴대폰 인증 상태 (useSignupPhoneVerification, 선택) */
  phoneVerification: SignupCodeVerification;
}

/**
 * 가입 공통 입력(이메일·비밀번호·비밀번호 확인·이름·휴대폰) — 고객·사장님·라이더 가입 폼(C-03~C-05) 공용.
 * 이메일 · 휴대폰 번호 옆 [인증번호 받기] → 인증번호 입력·[확인] → 인증됨. 이메일 인증은 필수, 휴대폰 인증은 선택이다.
 * 휴대폰 칸 아래 안내는 회원 유형별 문구이고, 알림 문자가 없는 라이더는 안내 줄을 그리지 않는다.
 * @param props idPrefix(입력칸 id 앞부분), role(회원 유형), register(폼 등록 함수), errors(필드 에러), emailVerification(이메일 인증 상태), phoneVerification(휴대폰 인증 상태)
 * @returns 공통 입력 요소
 */
export function SignupCommonFields({
  idPrefix,
  role,
  register,
  errors,
  emailVerification,
  phoneVerification,
}: SignupCommonFieldsProps): ReactNode {
  const emailId = `${idPrefix}-email`;
  const passwordId = `${idPrefix}-password`;
  const passwordConfirmId = `${idPrefix}-password-confirm`;
  const nameId = `${idPrefix}-name`;
  const phoneId = `${idPrefix}-phone`;

  return (
    <>
      <FormField
        id={emailId}
        label={
          <>
            이메일 <span className='text-note font-normal text-fg-muted'>*(인증 필수)</span>
          </>
        }
        hint={EMAIL_VERIFICATION_HINT}
        error={errors.email?.message}
      >
        <div className='flex gap-2'>
          <Input
            id={emailId}
            type='email'
            autoComplete='email'
            inputMode='email'
            maxLength={255}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={`${emailId}-message`}
            {...register('email', {
              onChange: (event: ChangeEvent<HTMLInputElement>) =>
                emailVerification.handleValueChange(event.target.value),
            })}
          />
          <CodeRequestButton
            verifier={emailVerification.verifier}
            isVerified={emailVerification.isVerified}
          />
        </div>
      </FormField>
      <CodeField
        verifier={emailVerification.verifier}
        id={`${idPrefix}-email-code`}
        hint={EMAIL_CODE_VALID_HINT}
      />
      <FormField
        id={passwordId}
        label='비밀번호'
        hint={PASSWORD_HINT}
        error={errors.password?.message}
      >
        <PasswordInput
          id={passwordId}
          autoComplete='new-password'
          maxLength={50}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={`${passwordId}-message`}
          {...register('password', { deps: 'passwordConfirm' })}
        />
      </FormField>
      <FormField
        id={passwordConfirmId}
        label='비밀번호 확인'
        error={errors.passwordConfirm?.message}
      >
        <PasswordInput
          id={passwordConfirmId}
          autoComplete='new-password'
          maxLength={50}
          aria-invalid={Boolean(errors.passwordConfirm)}
          aria-describedby={`${passwordConfirmId}-message`}
          {...register('passwordConfirm')}
        />
      </FormField>
      <FormField
        id={nameId}
        label='이름'
        error={errors.name?.message}
      >
        <Input
          id={nameId}
          autoComplete='name'
          maxLength={50}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={`${nameId}-message`}
          {...register('name')}
        />
      </FormField>
      <FormField
        id={phoneId}
        label='휴대폰 번호'
        hint={getPhoneVerificationHint(role) ?? undefined}
        error={errors.phone?.message}
      >
        <div className='flex gap-2'>
          <Input
            id={phoneId}
            type='tel'
            autoComplete='tel'
            inputMode='tel'
            placeholder='010-0000-0000'
            maxLength={13}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={`${phoneId}-message`}
            {...register('phone', {
              onChange: (event: ChangeEvent<HTMLInputElement>) =>
                phoneVerification.handleValueChange(event.target.value),
            })}
          />
          <CodeRequestButton
            verifier={phoneVerification.verifier}
            isVerified={phoneVerification.isVerified}
          />
        </div>
      </FormField>
      <CodeField
        verifier={phoneVerification.verifier}
        id={`${idPrefix}-phone-code`}
        hint={PHONE_CODE_VALID_HINT}
      />
    </>
  );
}
