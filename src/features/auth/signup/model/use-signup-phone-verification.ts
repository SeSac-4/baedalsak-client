import { useState } from 'react';

import {
  confirmPhoneCode,
  phoneSchema,
  requestPhoneCode,
  usePhoneCodeVerifier,
  type PhoneCodeConfirmResponse,
  type PhoneCodeVerifier,
} from '@/entities/session';

import { SIGNUP_PHONE_VERIFICATION_REQUIRED } from '../config/phone-verification';

/** 가입 요청에서 휴대폰 인증 표를 담는 서버 필드명 */
const PHONE_TOKEN_FIELD = 'phoneVerificationToken';
const PHONE_CHANGED_MESSAGE = '번호가 바뀌어서 다시 인증해야 해요.';
const PHONE_REQUIRED_MESSAGE = '휴대폰 인증을 해 주세요.';

/** 인증한 번호와 그 번호로 받은 표 */
interface VerifiedPhone {
  phone: string;
  token: string;
}

/** 가입 화면 휴대폰 인증 상태 */
export interface SignupPhoneVerification {
  /** 인증번호 받기·입력·확인 상태 (번호 형식을 먼저 확인하는 받기 핸들러로 바꿔 둠) */
  verifier: PhoneCodeVerifier;
  /** 지금 입력한 번호로 인증됐는지 */
  isVerified: boolean;
  /** 가입 요청에 넣을 표 (인증 안 했으면 undefined → 보내지 않음) */
  token: string | undefined;
  /** 번호 칸이 바뀔 때 호출한다. 인증(또는 요청)한 번호와 다르면 인증 상태를 풀고 표를 버린다 */
  handlePhoneChange: (phone: string) => void;
  /** 가입 요청의 필드 오류가 표 오류면 인증을 풀고 안내한 뒤 true를 돌려준다 */
  handleSignupFieldError: (field: string, message: string) => boolean;
  /** 인증 필수일 때 인증 안 했으면 안내하고 false를 돌려준다 (지금은 항상 true) */
  validateRequired: () => boolean;
}

/**
 * 번호 비교용으로 숫자만 남긴다 (010-1234-5678과 01012345678을 같은 번호로 본다).
 * @param phone - 입력한 번호
 * @returns 숫자만 남긴 번호
 */
const getPhoneDigits = (phone: string): string => phone.replace(/\D/g, '');

/**
 * 가입 화면(C-03~C-05) 휴대폰 인증. 인증은 선택이라 안 해도 가입할 수 있고, 인증하면 받은 표를 가입 요청에 넣는다.
 * 표는 인증한 번호에서만 통하므로, 인증한 뒤 번호를 바꾸면 인증 상태를 풀고 표를 버린다.
 * @returns 가입 휴대폰 인증 상태와 핸들러
 */
export const useSignupPhoneVerification = (): SignupPhoneVerification => {
  const [phone, setPhone] = useState<string>('');
  /** 마지막으로 인증번호를 요청한 번호 (입력칸이 열린 동안 이 번호와 비교) */
  const [requestedPhone, setRequestedPhone] = useState<string | null>(null);
  const [verified, setVerified] = useState<VerifiedPhone | null>(null);

  const verifier = usePhoneCodeVerifier<PhoneCodeConfirmResponse>({
    requestCode: () => requestPhoneCode({ phone: phone.trim() }),
    confirmCode: (code: string) => confirmPhoneCode({ phone: phone.trim(), code }),
    onVerified: ({ phoneVerificationToken }: PhoneCodeConfirmResponse): void => {
      setVerified({ phone, token: phoneVerificationToken });
    },
  });

  /** 번호 형식을 먼저 확인하고, 맞으면 인증번호를 요청한다 */
  const handleRequestClick = async (): Promise<void> => {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      verifier.setNotice(result.error.issues[0]?.message ?? null);
      return;
    }
    setRequestedPhone(phone);
    await verifier.handleRequestClick();
  };

  /**
   * 번호가 인증(또는 요청)한 번호와 달라지면 인증 상태를 풀고 표를 버린다.
   * @param nextPhone - 바뀐 번호
   */
  const handlePhoneChange = (nextPhone: string): void => {
    setPhone(nextPhone);
    const targetPhone = verified?.phone ?? requestedPhone;
    if (targetPhone === null || getPhoneDigits(targetPhone) === getPhoneDigits(nextPhone)) return;

    const wasVerified = verified !== null;
    setVerified(null);
    setRequestedPhone(null);
    verifier.reset();
    if (wasVerified) verifier.setNotice(PHONE_CHANGED_MESSAGE);
  };

  /**
   * 가입 요청의 표 오류(만료·재사용·다른 번호)면 인증을 풀고 인증 칸에 안내한다.
   * @param field - 서버 errors[].field
   * @param message - 보여 줄 문구
   * @returns 처리했으면 true
   */
  const handleSignupFieldError = (field: string, message: string): boolean => {
    if (field !== PHONE_TOKEN_FIELD) return false;
    setVerified(null);
    setRequestedPhone(null);
    verifier.reset();
    verifier.setNotice(message);
    return true;
  };

  /**
   * 인증 필수 설정이면 인증했는지 확인한다.
   * @returns 가입을 진행해도 되면 true
   */
  const validateRequired = (): boolean => {
    if (!SIGNUP_PHONE_VERIFICATION_REQUIRED || verified !== null) return true;
    verifier.setNotice(PHONE_REQUIRED_MESSAGE);
    return false;
  };

  return {
    verifier: { ...verifier, handleRequestClick },
    isVerified: verified !== null,
    token: verified?.token,
    handlePhoneChange,
    handleSignupFieldError,
    validateRequired,
  };
};
