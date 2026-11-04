import type { ReactNode } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/password-input';

import type { SignupCommonValues } from '../model/signup-schema';

export interface SignupCommonFieldsProps {
  /** 입력칸 id 앞부분 (예: 'customer' → customer-email) */
  idPrefix: string;
  /** 가입 폼의 register (역할별 폼 값은 공통 필드를 포함한다) */
  register: UseFormRegister<SignupCommonValues>;
  /** 가입 폼의 필드 에러 */
  errors: FieldErrors<SignupCommonValues>;
}

const PASSWORD_HINT = '8~50자, 영문 소문자와 숫자를 함께 넣어 주세요.';

/**
 * 가입 공통 입력(이메일·비밀번호·비밀번호 확인·이름·휴대폰) — 고객·사장님·라이더 가입 폼(C-03~C-05) 공용.
 * @param props idPrefix(입력칸 id 앞부분), register(폼 등록 함수), errors(필드 에러)
 * @returns 공통 입력 요소
 */
export function SignupCommonFields({ idPrefix, register, errors }: SignupCommonFieldsProps): ReactNode {
  const emailId = `${idPrefix}-email`;
  const passwordId = `${idPrefix}-password`;
  const passwordConfirmId = `${idPrefix}-password-confirm`;
  const nameId = `${idPrefix}-name`;
  const phoneId = `${idPrefix}-phone`;

  return (
    <>
      <FormField
        id={emailId}
        label='이메일'
        error={errors.email?.message}
      >
        <Input
          id={emailId}
          type='email'
          autoComplete='email'
          inputMode='email'
          maxLength={255}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={`${emailId}-message`}
          {...register('email')}
        />
      </FormField>
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
        error={errors.phone?.message}
      >
        <Input
          id={phoneId}
          type='tel'
          autoComplete='tel'
          inputMode='tel'
          placeholder='010-0000-0000'
          maxLength={13}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={`${phoneId}-message`}
          {...register('phone')}
        />
      </FormField>
    </>
  );
}
