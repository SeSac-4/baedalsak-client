import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { Controller, useForm, type Path } from 'react-hook-form';

import { VEHICLE_TYPE_LABEL, type VehicleType } from '@/entities/session';
import {
  parseSignupError,
  SignupCommonFields,
  SignupSubmitButton,
  signupRiderSchema,
  useSignup,
  VEHICLE_TYPES,
  type SignupResponse,
  type SignupRiderInput,
  type SignupRiderValues,
} from '@/features/auth/signup';
import { getErrorMessage } from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import { ChoiceButton, ChoiceGroup } from '@/shared/ui/choice';
import { FormField } from '@/shared/ui/form-field';
import { Icon, type IconName } from '@/shared/ui/icon';
import { Notice } from '@/shared/ui/notice';
import { useToast } from '@/shared/ui/toast';

export interface SignupRiderFormProps {
  /** 가입 성공 처리 (배달 대기 목록 이동 등) */
  onSuccess: (response: SignupResponse) => void;
}

const VEHICLE_FIELD_ID = 'rider-vehicle';

/** 운송수단 버튼 아이콘 (VEHICLE_TYPES 순서와 무관하게 값으로 찾는다) */
const VEHICLE_ICON: Record<VehicleType, IconName> = { WALK: 'walk', BICYCLE: 'bicycle', MOTORCYCLE: 'motorcycle' };
const RIDER_FIELDS: readonly string[] = ['email', 'password', 'name', 'phone', 'vehicleType'];

/**
 * 서버 필드명이 폼 필드인지 확인한다.
 * @param field - 서버 errors[].field
 * @returns 폼 필드 여부
 */
const isRiderField = (field: string): field is Path<SignupRiderInput> => RIDER_FIELDS.includes(field);

/**
 * 라이더 가입 폼 (C-05). 공통 입력에 운송수단(도보·자전거·오토바이)을 아이콘 버튼 3칸으로 더 받는다 (라이더 강조색).
 * 이메일 중복(409)·입력 오류(400)는 필드 아래에, 그 밖의 에러는 토스트로 보여 준다.
 * @param props onSuccess(가입 성공 처리)
 * @returns 라이더 가입 폼 요소
 */
export function SignupRiderForm({ onSuccess }: SignupRiderFormProps): ReactNode {
  const toast = useToast();
  const { mutateAsync: signup } = useSignup();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupRiderInput, unknown, SignupRiderValues>({
    resolver: zodResolver(signupRiderSchema),
    defaultValues: { email: '', password: '', passwordConfirm: '', name: '', phone: '', vehicleType: '' },
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
      className='flex flex-col gap-4'
    >
      <SignupCommonFields
        idPrefix='rider'
        register={register}
        errors={errors}
      />
      <FormField
        id={VEHICLE_FIELD_ID}
        label='운송수단'
        error={errors.vehicleType?.message}
        isGroup
      >
        <Controller
          name='vehicleType'
          control={control}
          render={({ field }) => (
            <ChoiceGroup
              data-role='RIDER'
              aria-labelledby={`${VEHICLE_FIELD_ID}-label`}
              aria-describedby={`${VEHICLE_FIELD_ID}-message`}
              aria-invalid={Boolean(errors.vehicleType)}
            >
              {VEHICLE_TYPES.map((vehicleType) => (
                <ChoiceButton
                  key={vehicleType}
                  ref={vehicleType === VEHICLE_TYPES[0] ? field.ref : undefined}
                  selected={field.value === vehicleType}
                  onClick={() => field.onChange(vehicleType)}
                  onBlur={field.onBlur}
                  className={cn('h-18 flex-col gap-1', errors.vehicleType && field.value === '' && 'border-warn')}
                >
                  <Icon
                    name={VEHICLE_ICON[vehicleType]}
                    size={24}
                    strokeWidth={1.8}
                  />
                  {VEHICLE_TYPE_LABEL[vehicleType]}
                </ChoiceButton>
              ))}
            </ChoiceGroup>
          )}
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
      <SignupSubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}
