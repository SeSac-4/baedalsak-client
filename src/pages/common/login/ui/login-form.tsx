import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import type { ReactNode } from 'react';
import { useForm, type Path } from 'react-hook-form';
import { Link } from 'react-router';

import { getErrorMessage, getFieldErrors } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Notice } from '@/shared/ui/notice';
import { PasswordInput } from '@/shared/ui/password-input';
import { Spinner } from '@/shared/ui/spinner';
import { useToast } from '@/shared/ui/toast';

import type { LoginResponse } from '../api/login-api';
import { loginSchema, type LoginFormValues } from '../model/login-schema';
import { useLogin } from '../model/use-login';

export interface LoginFormProps {
  /** 로그인 성공 처리 (역할별 홈 이동 등) */
  onSuccess: (response: LoginResponse) => void;
}

const INVALID_CREDENTIALS_MESSAGE = '이메일 또는 비밀번호를 확인하세요';
const LOGIN_FIELDS: readonly string[] = ['email', 'password'];
const PASSWORD_RESET_PATH = '/password-reset';

/**
 * 서버 필드명이 폼 필드인지 확인한다.
 * @param field - 서버 errors[].field
 * @returns 폼 필드 여부
 */
const isLoginField = (field: string): field is Path<LoginFormValues> => LOGIN_FIELDS.includes(field);

/**
 * 응답 상태 코드를 꺼낸다.
 * @param error - 요청 중 발생한 에러
 * @returns HTTP 상태 코드 (응답이 없으면 undefined)
 */
const getErrorStatus = (error: unknown): number | undefined =>
  axios.isAxiosError(error) ? error.response?.status : undefined;

/**
 * 이메일·비밀번호 로그인 폼 (C-01).
 * 401은 어떤 값이 틀렸는지 알려 주지 않고 한 문장으로, 400은 필드 아래에, 그 밖의 에러는 토스트로 보여 준다.
 * @param props onSuccess(로그인 성공 처리)
 * @returns 로그인 폼 요소
 */
export function LoginForm({ onSuccess }: LoginFormProps): ReactNode {
  const toast = useToast();
  const { mutateAsync: login } = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  /**
   * 로그인 실패를 상태 코드별로 보여 준다.
   * @param error - 로그인 요청 에러
   */
  const handleLoginError = (error: unknown): void => {
    const status = getErrorStatus(error);
    if (status === 401) {
      setError('root', { message: INVALID_CREDENTIALS_MESSAGE });
      return;
    }
    if (status === 400) {
      getFieldErrors(error).forEach(({ field, reason }) => {
        setError(isLoginField(field) ? field : 'root', { message: reason });
      });
      return;
    }
    toast(getErrorMessage(error));
  };

  /**
   * 로그인하고, 성공하면 상위로 결과를 넘긴다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      onSuccess(await login(values));
    } catch (error: unknown) {
      handleLoginError(error);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
      className='flex flex-col gap-4'
    >
      <FormField
        id='login-email'
        label='이메일'
        error={errors.email?.message}
      >
        <Input
          id='login-email'
          type='email'
          autoComplete='username'
          inputMode='email'
          maxLength={255}
          aria-invalid={Boolean(errors.email)}
          aria-describedby='login-email-message'
          {...register('email')}
        />
      </FormField>
      <FormField
        id='login-password'
        label='비밀번호'
        error={errors.password?.message}
        aside={
          <Link
            to={PASSWORD_RESET_PATH}
            className='-my-3 inline-flex min-h-11 items-center rounded-control px-1 text-fg-muted underline-offset-2 hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink'
          >
            비밀번호를 잊으셨나요?
          </Link>
        }
      >
        <PasswordInput
          id='login-password'
          autoComplete='current-password'
          maxLength={50}
          aria-invalid={Boolean(errors.password)}
          aria-describedby='login-password-message'
          {...register('password')}
        />
      </FormField>
      {errors.root ? (
        <Notice
          tone='warn'
          role='alert'
        >
          {errors.root.message}
        </Notice>
      ) : null}
      <Button
        type='submit'
        size='lg'
        block
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Spinner
            size={14}
            label='로그인 중'
            className='border-current border-t-transparent'
          />
        ) : null}
        로그인
      </Button>
      <p className='text-center text-note leading-[1.45] text-fg-muted'>
        로그인하면 역할(고객·사장님·라이더)에 따라 첫 화면으로 이동해요.
      </p>
    </form>
  );
}
