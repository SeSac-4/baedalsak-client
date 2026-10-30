import axios from 'axios';

import { getErrorCode, getFieldErrors } from '@/shared/api';

/** 폼 필드에 표시할 가입 에러 */
export interface SignupFieldError {
  /** 서버 필드명 (폼에 없는 필드면 폼 공통 에러로 보여 준다) */
  field: string;
  message: string;
}

const EMAIL_DUPLICATED = 'EMAIL_DUPLICATED';
const EMAIL_DUPLICATED_MESSAGE = '이미 가입된 이메일이에요.';

/**
 * 가입 실패 응답을 필드 에러로 바꾼다. 409 EMAIL_DUPLICATED는 이메일 필드, 400은 errors[] 필드별.
 * @param error - 가입 요청 에러
 * @returns 필드 에러 목록 (필드로 보여 줄 수 없는 에러면 null → 토스트로 처리)
 */
export const parseSignupError = (error: unknown): SignupFieldError[] | null => {
  if (getErrorCode(error) === EMAIL_DUPLICATED) return [{ field: 'email', message: EMAIL_DUPLICATED_MESSAGE }];

  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  if (status !== 400) return null;

  const fieldErrors = getFieldErrors(error).map(({ field, reason }) => ({ field, message: reason }));
  return fieldErrors.length > 0 ? fieldErrors : null;
};
