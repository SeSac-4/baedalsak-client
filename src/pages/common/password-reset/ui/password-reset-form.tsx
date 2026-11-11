import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { useForm, type Path } from 'react-hook-form';

import { PASSWORD_HINT } from '@/entities/session';
import { Button } from '@/shared/ui/button';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Notice } from '@/shared/ui/notice';
import { PasswordInput } from '@/shared/ui/password-input';
import { Spinner } from '@/shared/ui/spinner';
import { useToast } from '@/shared/ui/toast';

import { parsePasswordResetError } from '../lib/parse-password-reset-error';
import { passwordResetSchema, type PasswordResetValues } from '../model/password-reset-schema';
import { useConfirmPasswordReset } from '../model/use-confirm-password-reset';
import { useRequestPasswordReset } from '../model/use-request-password-reset';

export interface PasswordResetFormProps {
  /** 1단계에서 입력한 이메일 (화면 표시·요청 본문) */
  email: string;
  /** '이메일 바꾸기' (1단계로 돌아가기) */
  onChangeEmail: () => void;
  /** 새 비밀번호 설정 성공 처리 (로그인 화면으로 이동) */
  onSuccess: () => void;
}

/** 서버 필드명 중 이 폼에 칸이 있는 것 (그 밖의 필드 오류는 안내 상자로) */
const RESET_FIELDS: readonly string[] = ['code', 'newPassword'];
const RESEND_SUCCESS_MESSAGE = '인증 코드를 다시 보냈어요.';

/**
 * 서버 필드명이 폼 필드인지 확인한다.
 * @param field - 서버 errors[].field
 * @returns 폼 필드 여부
 */
const isResetField = (field: string): field is Path<PasswordResetValues> => RESET_FIELDS.includes(field);

/**
 * 비밀번호 찾기 2단계 — 메일로 받은 인증 코드와 새 비밀번호를 받아 비밀번호를 바꾼다.
 * 코드 틀림·만료와 비밀번호 규칙은 칸 아래, 429는 안내 상자, 503 등은 토스트로 보여 준다.
 * @param props email(1단계 이메일), onChangeEmail(1단계로), onSuccess(설정 성공 처리)
 * @returns 인증 코드·새 비밀번호 폼 요소
 */
export function PasswordResetForm({ email, onChangeEmail, onSuccess }: PasswordResetFormProps): ReactNode {
  const toast = useToast();
  const { mutateAsync: confirmReset } = useConfirmPasswordReset();
  const { mutateAsync: requestCode, isPending: isResending } = useRequestPasswordReset();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { code: '', newPassword: '', newPasswordConfirm: '' },
  });

  /**
   * 요청 실패를 칸 아래·안내 상자·토스트 중 한 곳에 보여 준다.
   * @param error - 재설정 또는 코드 재요청 에러
   */
  const handleResetError = (error: unknown): void => {
    const parsed = parsePasswordResetError(error);
    if (parsed.type === 'field') {
      parsed.fieldErrors.forEach(({ field, reason }) => {
        setError(isResetField(field) ? field : 'root', { message: reason });
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
   * 인증 코드 메일을 다시 요청한다. 새 코드를 받으므로 이전 코드 오류는 지운다.
   */
  const handleResendClick = async (): Promise<void> => {
    clearErrors('root');
    clearErrors('code');
    try {
      await requestCode({ email });
      toast(RESEND_SUCCESS_MESSAGE, 'success');
    } catch (error: unknown) {
      handleResetError(error);
    }
  };

  /**
   * 새 비밀번호를 확정하고, 성공하면 상위로 알린다. 비밀번호 확인 칸은 보내지 않는다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async ({ code, newPassword }: PasswordResetValues): Promise<void> => {
    try {
      await confirmReset({ email, code, newPassword });
      onSuccess();
    } catch (error: unknown) {
      handleResetError(error);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
      className='flex flex-col gap-4'
    >
      <Notice
        tone='role'
        icon='info'
      >
        <p className='font-semibold break-all text-fg'>{email}</p>
        <p>위 이메일로 인증 코드를 보냈어요.</p>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={onChangeEmail}
          className='-ml-3 text-role-ink'
        >
          이메일 바꾸기
        </Button>
      </Notice>
      <p className='text-note leading-[1.45] text-fg-muted'>
        메일은 no-reply@verificationemail.com에서 영어로 와요. 메일이 안 보이면 스팸함도 확인해 주세요.
      </p>
      <FormField
        id='password-reset-code'
        label='인증 코드'
        hint='메일로 받은 숫자 6자리'
        error={errors.code?.message}
        aside={
          <Button
            type='button'
            variant='ghost'
            size='sm'
            disabled={isResending}
            onClick={handleResendClick}
            className='-my-2 -mr-3 text-role-ink'
          >
            {isResending ? '보내는 중…' : '코드 다시 받기'}
          </Button>
        }
      >
        <Input
          id='password-reset-code'
          autoComplete='one-time-code'
          inputMode='numeric'
          maxLength={6}
          aria-invalid={Boolean(errors.code)}
          aria-describedby='password-reset-code-message'
          {...register('code')}
        />
      </FormField>
      <FormField
        id='password-reset-new-password'
        label='새 비밀번호'
        hint={PASSWORD_HINT}
        error={errors.newPassword?.message}
      >
        <PasswordInput
          id='password-reset-new-password'
          autoComplete='new-password'
          maxLength={50}
          aria-invalid={Boolean(errors.newPassword)}
          aria-describedby='password-reset-new-password-message'
          {...register('newPassword', { deps: 'newPasswordConfirm' })}
        />
      </FormField>
      <FormField
        id='password-reset-new-password-confirm'
        label='새 비밀번호 확인'
        error={errors.newPasswordConfirm?.message}
      >
        <PasswordInput
          id='password-reset-new-password-confirm'
          autoComplete='new-password'
          maxLength={50}
          aria-invalid={Boolean(errors.newPasswordConfirm)}
          aria-describedby='password-reset-new-password-confirm-message'
          {...register('newPasswordConfirm')}
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
            label='비밀번호 바꾸는 중'
            className='border-current border-t-transparent'
          />
        ) : null}
        비밀번호 바꾸기
      </Button>
    </form>
  );
}
