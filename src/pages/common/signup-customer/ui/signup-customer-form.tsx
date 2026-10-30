import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { useForm, type Path } from 'react-hook-form';

import {
  parseSignupError,
  signupCommonSchema,
  SignupCommonFields,
  useSignup,
  type SignupCommonValues,
  type SignupResponse,
} from '@/features/auth/signup';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/ui/toast';

export interface SignupCustomerFormProps {
  /** 가입 성공 처리 (첫 화면 이동 등) */
  onSuccess: (response: SignupResponse) => void;
}

const ERROR_CLASS = 'text-note text-warn';
const CUSTOMER_FIELDS: readonly string[] = ['email', 'password', 'name', 'phone'];

/**
 * 서버 필드명이 폼 필드인지 확인한다.
 * @param field - 서버 errors[].field
 * @returns 폼 필드 여부
 */
const isCustomerField = (field: string): field is Path<SignupCommonValues> => CUSTOMER_FIELDS.includes(field);

/**
 * 고객 가입 폼 (C-03). 이메일 중복(409)·입력 오류(400)는 필드 아래에, 그 밖의 에러는 토스트로 보여 준다.
 * @param props onSuccess(가입 성공 처리)
 * @returns 고객 가입 폼 요소
 */
export function SignupCustomerForm({ onSuccess }: SignupCustomerFormProps): ReactNode {
  const toast = useToast();
  const { mutateAsync: signup } = useSignup();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupCommonValues>({
    resolver: zodResolver(signupCommonSchema),
    defaultValues: { email: '', password: '', name: '', phone: '' },
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
      setError(isCustomerField(field) ? field : 'root', { message });
    });
  };

  /**
   * 가입하고, 성공하면 상위로 결과를 넘긴다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: SignupCommonValues): Promise<void> => {
    try {
      onSuccess(await signup({ role: 'CUSTOMER', body: values }));
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
