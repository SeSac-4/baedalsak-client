import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { useForm, type Path } from 'react-hook-form';

import { VEHICLE_TYPE_LABEL } from '@/entities/session';
import {
  parseSignupError,
  SignupCommonFields,
  signupRiderSchema,
  useSignup,
  VEHICLE_TYPES,
  type SignupResponse,
  type SignupRiderInput,
  type SignupRiderValues,
} from '@/features/auth/signup';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Select } from '@/shared/ui/select';
import { useToast } from '@/shared/ui/toast';

export interface SignupRiderFormProps {
  /** 가입 성공 처리 (배달 대기 목록 이동 등) */
  onSuccess: (response: SignupResponse) => void;
}

const LABEL_CLASS = 'flex flex-col gap-1 text-note font-medium text-fg-muted';
const ERROR_CLASS = 'text-note text-warn';
const RIDER_FIELDS: readonly string[] = ['email', 'password', 'name', 'phone', 'vehicleType'];

/**
 * 서버 필드명이 폼 필드인지 확인한다.
 * @param field - 서버 errors[].field
 * @returns 폼 필드 여부
 */
const isRiderField = (field: string): field is Path<SignupRiderInput> => RIDER_FIELDS.includes(field);

/**
 * 라이더 가입 폼 (C-05). 공통 입력에 운송수단(도보·자전거·오토바이)을 더 받는다.
 * 이메일 중복(409)·입력 오류(400)는 필드 아래에, 그 밖의 에러는 토스트로 보여 준다.
 * @param props onSuccess(가입 성공 처리)
 * @returns 라이더 가입 폼 요소
 */
export function SignupRiderForm({ onSuccess }: SignupRiderFormProps): ReactNode {
  const toast = useToast();
  const { mutateAsync: signup } = useSignup();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupRiderInput, unknown, SignupRiderValues>({
    resolver: zodResolver(signupRiderSchema),
    defaultValues: { email: '', password: '', name: '', phone: '', vehicleType: '' },
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
      setError(isRiderField(field) ? field : 'root', { message });
    });
  };

  /**
   * 가입하고, 성공하면 상위로 결과를 넘긴다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: SignupRiderValues): Promise<void> => {
    try {
      onSuccess(await signup({ role: 'RIDER', body: values }));
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
        운송수단
        <Select
          aria-invalid={Boolean(errors.vehicleType)}
          {...register('vehicleType')}
        >
          <option
            value=''
            disabled
          >
            운송수단을 골라 주세요
          </option>
          {VEHICLE_TYPES.map((vehicleType) => (
            <option
              key={vehicleType}
              value={vehicleType}
            >
              {VEHICLE_TYPE_LABEL[vehicleType]}
            </option>
          ))}
        </Select>
        {errors.vehicleType ? <span className={ERROR_CLASS}>{errors.vehicleType.message}</span> : null}
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
