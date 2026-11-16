import axios from 'axios';

import { getErrorCode, getErrorMessage, getFieldErrors } from '@/shared/api';

import type { CodeVerificationError } from '../model/use-code-verifier';

const CODE_INVALID_MESSAGE = '인증번호가 올바르지 않거나 만료되었습니다.';
const TOO_MANY_REQUESTS_MESSAGE = '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.';

/**
 * 400 응답의 필드 오류를 인증 영역 표시로 바꾼다. 인증번호 칸 오류는 칸 아래, 그 밖(번호·이메일 형식 등)은 안내 상자.
 * @param error - 요청 에러
 * @returns 표시 방법 (필드 오류가 없으면 null)
 */
const parseFieldError = (error: unknown): CodeVerificationError | null => {
  const [fieldError] = getFieldErrors(error);
  if (!fieldError) return null;
  if (fieldError.field === 'code') return { type: 'code', message: CODE_INVALID_MESSAGE, clearCode: false };
  return { type: 'notice', message: fieldError.reason };
};

/**
 * 인증번호 요청·확인 에러를 표시 방법별로 나눈다 (휴대폰 · 이메일 공용 순서).
 * 서버 에러 코드 표 → 코드 없는 429(gateway 요청 제한) → 400 필드 오류 → 그 밖은 토스트.
 * @param error - 요청 에러
 * @param errorByCode - 서버 에러 코드별 표시 방법 (휴대폰 · 이메일마다 다르다)
 * @returns 표시 방법과 문구
 */
export const parseCodeVerificationError = (
  error: unknown,
  errorByCode: Readonly<Record<string, CodeVerificationError>>,
): CodeVerificationError => {
  const code = getErrorCode(error);
  if (code && errorByCode[code]) return errorByCode[code];

  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  // gateway 요청 제한은 본문 코드 없이 올 수 있다
  if (status === 429) return { type: 'notice', message: TOO_MANY_REQUESTS_MESSAGE };
  if (status === 400) {
    const fieldError = parseFieldError(error);
    if (fieldError) return fieldError;
  }
  return { type: 'toast', message: getErrorMessage(error) };
};

/** 휴대폰 · 이메일 공통: gateway IP 요청 제한 */
export const TOO_MANY_REQUESTS_ERROR: CodeVerificationError = { type: 'notice', message: TOO_MANY_REQUESTS_MESSAGE };
