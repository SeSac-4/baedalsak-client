import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type ReactNode } from 'react';
import { useForm, type Path } from 'react-hook-form';

import {
  ADDRESS_DETAIL_MAX_LENGTH,
  AddressLocationField,
  parseAddressField,
  type AddressLocation,
} from '@/entities/address';
import {
  parseSignupError,
  signupCustomerSchema,
  SIGNUP_EMAIL_REQUIRED_MESSAGE,
  SignupCommonFields,
  SignupSubmitButton,
  useSignup,
  useSignupEmailVerification,
  useSignupPhoneVerification,
  type SignupAddressRequest,
  type SignupCommonValues,
  type SignupResponse,
} from '@/features/auth/signup';
import { getErrorMessage } from '@/shared/api';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Notice } from '@/shared/ui/notice';
import { useToast } from '@/shared/ui/toast';

export interface SignupCustomerFormProps {
  /** 가입 성공 처리 (첫 화면 이동 등) */
  onSuccess: (response: SignupResponse) => void;
}

const CUSTOMER_FIELDS: readonly string[] = ['email', 'password', 'name', 'phone'];
const ADDRESS_ID = 'customer-address';
const ADDRESS_DETAIL_ID = 'customer-address-detail';

/** 배달 주소 칸 오류 (주소 · 동 · 좌표는 주소 칸, 상세 주소는 상세 칸) */
interface AddressErrors {
  address?: string;
  addressDetail?: string;
}

/**
 * 고른 배달 주소를 가입 요청의 address로 바꾼다. 주소를 고르지 않았으면 보내지 않는다.
 * @param location - 고른 주소 위치 (없으면 null)
 * @param addressDetail - 상세 주소
 * @returns 배달 주소 본문 (없으면 undefined)
 */
const parseSignupAddress = (
  location: AddressLocation | null,
  addressDetail: string,
): SignupAddressRequest | undefined =>
  location ? { ...location, addressDetail: addressDetail.trim() || undefined } : undefined;

/**
 * 서버 필드명이 폼 필드인지 확인한다.
 * @param field - 서버 errors[].field
 * @returns 폼 필드 여부
 */
const isCustomerField = (field: string): field is Path<SignupCommonValues> => CUSTOMER_FIELDS.includes(field);

/**
 * 고객 가입 폼 (C-03). 이메일 중복(409)·입력 오류(400)는 필드 아래에, 그 밖의 에러는 토스트로 보여 준다.
 * 휴대폰 아래 배달 주소는 선택이다. 고르면 첫 주소 = 기본 주소로 저장되고, 비우면 address를 보내지 않는다.
 * @param props onSuccess(가입 성공 처리)
 * @returns 고객 가입 폼 요소
 */
export function SignupCustomerForm({ onSuccess }: SignupCustomerFormProps): ReactNode {
  const toast = useToast();
  const { mutateAsync: signup } = useSignup();
  const emailVerification = useSignupEmailVerification();
  const phoneVerification = useSignupPhoneVerification();
  const [addressLocation, setAddressLocation] = useState<AddressLocation | null>(null);
  const [addressDetail, setAddressDetail] = useState<string>('');
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupCommonValues>({
    resolver: zodResolver(signupCustomerSchema),
    defaultValues: { email: '', password: '', passwordConfirm: '', name: '', phone: '' },
  });

  /** 고른 배달 주소를 지운다 (주소는 선택이라 비우고 가입할 수 있다) */
  const handleAddressClear = (): void => {
    setAddressLocation(null);
    setAddressDetail('');
    setAddressErrors({});
  };

  /**
   * 가입 실패를 필드 에러 또는 토스트로 보여 준다. 이메일 · 휴대폰 인증 표 오류는 인증을 풀고 그 인증 칸에 안내한다.
   * @param error - 가입 요청 에러
   */
  const handleSignupError = (error: unknown): void => {
    const fieldErrors = parseSignupError(error);
    if (!fieldErrors) {
      toast(getErrorMessage(error));
      return;
    }
    const nextAddressErrors: AddressErrors = {};
    fieldErrors.forEach(({ field, message }) => {
      const addressField = parseAddressField(field);
      if (addressField) {
        nextAddressErrors[addressField === 'addressDetail' ? 'addressDetail' : 'address'] = message;
        return;
      }
      if (emailVerification.handleSignupFieldError(field, message)) return;
      if (phoneVerification.handleSignupFieldError(field, message)) return;
      setError(isCustomerField(field) ? field : 'root', { message });
    });
    setAddressErrors(nextAddressErrors);
  };

  /**
   * 가입하고, 성공하면 상위로 결과를 넘긴다. 이메일 인증 표(필수)와, 휴대폰을 인증했으면 휴대폰 표, 배달 주소를 골랐으면 주소를 함께 보낸다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: SignupCommonValues): Promise<void> => {
    if (!emailVerification.validateRequired() || !emailVerification.token) return;
    if (!phoneVerification.validateRequired()) return;
    try {
      onSuccess(
        await signup({
          role: 'CUSTOMER',
          body: values,
          emailVerificationToken: emailVerification.token,
          phoneVerificationToken: phoneVerification.token,
          address: parseSignupAddress(addressLocation, addressDetail),
        }),
      );
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
        idPrefix='customer'
        register={register}
        errors={errors}
        emailVerification={emailVerification}
        phoneVerification={phoneVerification}
      />
      <AddressLocationField
        id={ADDRESS_ID}
        label={
          <>
            배달 주소 <span className='text-note font-normal text-fg-muted'>(선택)</span>
          </>
        }
        hint='입력하면 기본 배달 주소로 저장돼요. 나중에 내 정보에서 추가할 수도 있어요.'
        value={addressLocation}
        onChange={(location) => {
          setAddressLocation(location);
          setAddressErrors({});
        }}
        error={addressErrors.address}
      />
      {addressLocation ? (
        <FormField
          id={ADDRESS_DETAIL_ID}
          label='상세 주소'
          error={addressErrors.addressDetail}
          aside={
            <button
              type='button'
              onClick={handleAddressClear}
              className='min-h-6 rounded-control px-1 underline underline-offset-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-role-ink'
            >
              배달 주소 지우기
            </button>
          }
        >
          <Input
            id={ADDRESS_DETAIL_ID}
            value={addressDetail}
            onChange={(event) => setAddressDetail(event.target.value)}
            placeholder='예: 302호'
            maxLength={ADDRESS_DETAIL_MAX_LENGTH}
            aria-invalid={Boolean(addressErrors.addressDetail)}
            aria-describedby={`${ADDRESS_DETAIL_ID}-message`}
          />
        </FormField>
      ) : null}
      {errors.root ? (
        <Notice
          tone='warn'
          role='alert'
        >
          {errors.root.message}
        </Notice>
      ) : null}
      <SignupSubmitButton
        isSubmitting={isSubmitting}
        blockedReason={emailVerification.isVerified ? null : SIGNUP_EMAIL_REQUIRED_MESSAGE}
      />
    </form>
  );
}
