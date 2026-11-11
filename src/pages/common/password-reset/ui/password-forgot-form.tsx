import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Notice } from '@/shared/ui/notice';
import { Spinner } from '@/shared/ui/spinner';
import { useToast } from '@/shared/ui/toast';

import { parsePasswordResetError } from '../lib/parse-password-reset-error';
import { passwordForgotSchema, type PasswordForgotValues } from '../model/password-reset-schema';
import { useRequestPasswordReset } from '../model/use-request-password-reset';

export interface PasswordForgotFormProps {
  /** 처음 채워 둘 이메일 (2단계에서 '이메일 바꾸기'로 돌아온 경우) */
  defaultEmail: string;
  /** 메일 요청 성공 처리 (2단계로 이동) */
  onSuccess: (email: string) => void;
}

/**
 * 비밀번호 찾기 1단계 — 이메일을 받아 인증 코드 메일을 요청한다.
 * 서버는 가입 여부와 관계없이 성공을 주므로, 성공하면 항상 2단계로 넘어간다.
 * @param props defaultEmail(처음 이메일), onSuccess(메일 요청 성공 처리)
 * @returns 이메일 입력 폼 요소
 */
export function PasswordForgotForm({ defaultEmail, onSuccess }: PasswordForgotFormProps): ReactNode {
  const toast = useToast();
  const { mutateAsync: requestCode } = useRequestPasswordReset();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForgotValues>({
    resolver: zodResolver(passwordForgotSchema),
    defaultValues: { email: defaultEmail },
  });

  /**
   * 메일 요청 실패를 이메일 칸·안내 상자·토스트 중 한 곳에 보여 준다.
   * @param error - 메일 요청 에러
   */
  const handleRequestError = (error: unknown): void => {
    const parsed = parsePasswordResetError(error);
    if (parsed.type === 'field') {
      parsed.fieldErrors.forEach(({ field, reason }) => {
        setError(field === 'email' ? 'email' : 'root', { message: reason });
      });
      return;
    }
    if (parsed.type === 'root') {
      setError('root', { message: parsed.message });
      return;
    }
    toast(parsed.message);
  };

  /**
   * 인증 코드 메일을 요청하고, 성공하면 이메일을 상위로 넘긴다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async ({ email }: PasswordForgotValues): Promise<void> => {
    try {
      await requestCode({ email });
      onSuccess(email);
    } catch (error: unknown) {
      handleRequestError(error);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
      className='flex flex-col gap-4'
    >
      <p className='leading-[1.45] text-fg-muted'>
        가입한 이메일을 입력하면 비밀번호를 다시 설정할 수 있는 인증 코드를 보내 드려요.
      </p>
      <FormField
        id='password-forgot-email'
        label='이메일'
        error={errors.email?.message}
      >
        <Input
          id='password-forgot-email'
          type='email'
          autoComplete='email'
          inputMode='email'
          maxLength={255}
          aria-invalid={Boolean(errors.email)}
          aria-describedby='password-forgot-email-message'
          {...register('email')}
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
            label='메일 보내는 중'
            className='border-current border-t-transparent'
          />
        ) : null}
        인증 코드 받기
      </Button>
    </form>
  );
}
