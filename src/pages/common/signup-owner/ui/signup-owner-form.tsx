import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { useForm, type Path } from 'react-hook-form';

import {
  parseSignupError,
  SignupCommonFields,
  signupOwnerSchema,
  useSignup,
  type SignupOwnerValues,
  type SignupResponse,
} from '@/features/auth/signup';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useToast } from '@/shared/ui/toast';

export interface SignupOwnerFormProps {
  /** 가입 성공 처리 (가게 등록 이동 등) */
  onSuccess: (response: SignupResponse) => void;
}

const LABEL_CLASS = 'flex flex-col gap-1 text-note font-medium text-fg-muted';
const ERROR_CLASS = 'text-note text-warn';
const HINT_CLASS = 'text-note font-normal text-fg-muted';
const OWNER_FIELDS: readonly string[] = ['email', 'password', 'name', 'phone', 'storeName'];

/**
 * 서버 필드명이 폼 필드인지 확인한다.
 * @param field - 서버 errors[].field
 * @returns 폼 필드 여부
 */
const isOwnerField = (field: string): field is Path<SignupOwnerValues> => OWNER_FIELDS.includes(field);

/**
 * 사장님 가입 폼 (C-04). 공통 입력에 가게 이름을 더 받는다.
 * 이메일 중복(409)·입력 오류(400)는 필드 아래에, 그 밖의 에러는 토스트로 보여 준다.
 * @param props onSuccess(가입 성공 처리)
 * @returns 사장님 가입 폼 요소
 */
export function SignupOwnerForm({ onSuccess }: SignupOwnerFormProps): ReactNode {
  const toast = useToast();
  const { mutateAsync: signup } = useSignup();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupOwnerValues>({
    resolver: zodResolver(signupOwnerSchema),
    defaultValues: { email: '', password: '', name: '', phone: '', storeName: '' },
  });

  /**
   * 가입 실패를 필드 에러 또는 토스트로 보여 준다.
   * @param error - 가입 요청 에러
   */
  const handleSignupError = (error: unknown): void => {
    const fieldErrors = parseSignupError(error);
    if (!fieldErrors) {
      toast(getErrorMessage(error));
      return;
    }
    fieldErrors.forEach(({ field, message }) => {
      setError(isOwnerField(field) ? field : 'root', { message });
    });
  };

  /**
   * 가입하고, 성공하면 상위로 결과를 넘긴다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: SignupOwnerValues): Promise<void> => {
    try {
      onSuccess(await signup({ role: 'OWNER', body: values }));
    } catch (error: unknown) {
      handleSignupError(error);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
      className='flex flex-col gap-3'
    >
      <SignupCommonFields
        register={register}
        errors={errors}
      />
      <label className={LABEL_CLASS}>
        가게 이름
        <Input
          autoComplete='organization'
          maxLength={100}
          aria-invalid={Boolean(errors.storeName)}
          {...register('storeName')}
        />
        {errors.storeName ? (
          <span className={ERROR_CLASS}>{errors.storeName.message}</span>
        ) : (
          <span className={HINT_CLASS}>가입 후 가게 등록 화면에 기본값으로 채워져요.</span>
        )}
      </label>
      {errors.root ? (
        <p
          role='alert'
          className={ERROR_CLASS}
        >
          {errors.root.message}
        </p>
      ) : null}
      <Button
        type='submit'
        size='lg'
        block
        disabled={isSubmitting}
      >
        가입하기
      </Button>
    </form>
  );
}
