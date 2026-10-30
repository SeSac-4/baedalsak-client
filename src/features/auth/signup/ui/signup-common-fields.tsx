import type { ReactNode } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input } from '@/shared/ui/input';

import type { SignupCommonValues } from '../model/signup-schema';

export interface SignupCommonFieldsProps {
  /** 가입 폼의 register (역할별 폼 값은 공통 필드를 포함한다) */
  register: UseFormRegister<SignupCommonValues>;
  /** 가입 폼의 필드 에러 */
  errors: FieldErrors<SignupCommonValues>;
}

const LABEL_CLASS = 'flex flex-col gap-1 text-note font-medium text-fg-muted';
const ERROR_CLASS = 'text-note text-warn';
const HINT_CLASS = 'text-note font-normal text-fg-muted';

/**
 * 가입 공통 입력(이메일·비밀번호·이름·휴대폰) — 고객·사장님·라이더 가입 폼(C-03~C-05) 공용.
 * @param props register(폼 등록 함수), errors(필드 에러)
 * @returns 공통 입력 요소
 */
export function SignupCommonFields({ register, errors }: SignupCommonFieldsProps): ReactNode {
  return (
    <>
      <label className={LABEL_CLASS}>
        이메일
        <Input
          type='email'
          autoComplete='username'
          inputMode='email'
          maxLength={255}
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email ? <span className={ERROR_CLASS}>{errors.email.message}</span> : null}
      </label>
      <label className={LABEL_CLASS}>
        비밀번호
        <Input
          type='password'
          autoComplete='new-password'
          maxLength={50}
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
        {errors.password ? (
          <span className={ERROR_CLASS}>{errors.password.message}</span>
        ) : (
          <span className={HINT_CLASS}>8~50자, 영문 소문자와 숫자를 함께 넣어 주세요.</span>
        )}
      </label>
      <label className={LABEL_CLASS}>
        이름
        <Input
          autoComplete='name'
          maxLength={50}
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
        />
        {errors.name ? <span className={ERROR_CLASS}>{errors.name.message}</span> : null}
      </label>
      <label className={LABEL_CLASS}>
        휴대폰 번호
        <Input
          type='tel'
          autoComplete='tel'
          inputMode='tel'
          placeholder='010-0000-0000'
          maxLength={13}
          aria-invalid={Boolean(errors.phone)}
          {...register('phone')}
        />
        {errors.phone ? <span className={ERROR_CLASS}>{errors.phone.message}</span> : null}
      </label>
    </>
  );
}
