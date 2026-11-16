import { confirmPhoneCode, parsePhoneVerificationError, phoneSchema, requestPhoneCode } from '@/entities/session';

import { SIGNUP_PHONE_VERIFICATION_REQUIRED } from '../config/phone-verification';
import {
  useSignupCodeVerification,
  type SignupCodeVerification,
  type SignupCodeVerificationConfig,
} from './use-signup-code-verification';

/**
 * 번호 비교용으로 숫자만 남긴다 (010-1234-5678과 01012345678을 같은 번호로 본다).
 * @param phone - 입력한 번호
 * @returns 숫자만 남긴 번호
 */
const getPhoneDigits = (phone: string): string => phone.replace(/\D/g, '');

/** 가입 화면 휴대폰 인증 설정 */
const PHONE_VERIFICATION_CONFIG: SignupCodeVerificationConfig = {
  schema: phoneSchema,
  normalize: getPhoneDigits,
  requestCode: (phone: string) => requestPhoneCode({ phone }),
  confirmCode: async (phone: string, code: string): Promise<string> =>
    (await confirmPhoneCode({ phone, code })).phoneVerificationToken,
  parseError: parsePhoneVerificationError,
  tokenField: 'phoneVerificationToken',
  changedMessage: '번호가 바뀌어서 다시 인증해야 해요.',
  requiredMessage: '휴대폰 인증을 해 주세요.',
  required: SIGNUP_PHONE_VERIFICATION_REQUIRED,
};

/**
 * 가입 화면(C-03~C-05) 휴대폰 인증. 인증은 선택이라 안 해도 가입할 수 있고, 인증하면 받은 표를 가입 요청에 넣는다.
 * 인증한 뒤 번호를 바꾸면 인증 상태를 풀고 표를 버린다.
 * @returns 가입 휴대폰 인증 상태와 핸들러
 */
export const useSignupPhoneVerification = (): SignupCodeVerification =>
  useSignupCodeVerification(PHONE_VERIFICATION_CONFIG);
