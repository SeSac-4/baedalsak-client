import { confirmEmailCode, emailSchema, parseEmailVerificationError, requestEmailCode } from '@/entities/session';

import { SIGNUP_EMAIL_REQUIRED_MESSAGE } from '../config/email-verification';
import {
  useSignupCodeVerification,
  type SignupCodeVerification,
  type SignupCodeVerificationConfig,
} from './use-signup-code-verification';

/**
 * 이메일 비교용 모양. 서버처럼 앞뒤 공백을 빼고 소문자로 맞춘다.
 * @param email - 입력한 이메일
 * @returns 비교용 이메일
 */
const normalizeEmail = (email: string): string => email.trim().toLowerCase();

/** 가입 화면 이메일 인증 설정 (필수) */
const EMAIL_VERIFICATION_CONFIG: SignupCodeVerificationConfig = {
  schema: emailSchema,
  normalize: normalizeEmail,
  requestCode: (email: string) => requestEmailCode({ email }),
  confirmCode: async (email: string, code: string): Promise<string> =>
    (await confirmEmailCode({ email, code })).emailVerificationToken,
  parseError: parseEmailVerificationError,
  codeFormatMessage: '메일로 받은 숫자 6자리를 입력해 주세요.',
  tokenField: 'emailVerificationToken',
  changedMessage: '이메일이 바뀌어서 다시 인증해야 해요.',
  requiredMessage: SIGNUP_EMAIL_REQUIRED_MESSAGE,
  required: true,
};

/**
 * 가입 화면(C-03~C-05) 이메일 인증. 인증은 필수라 인증 전에는 가입 버튼을 막고, 받은 표를 가입 요청에 넣는다.
 * 인증한 뒤 이메일을 바꾸면 인증 상태를 풀고 표를 버린다.
 * @returns 가입 이메일 인증 상태와 핸들러
 */
export const useSignupEmailVerification = (): SignupCodeVerification =>
  useSignupCodeVerification(EMAIL_VERIFICATION_CONFIG);
