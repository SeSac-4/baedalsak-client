import axios from 'axios';

import { getErrorCode, getErrorMessage, getFieldErrors } from '@/shared/api';

/** 휴대폰 인증 실패를 어디에 어떻게 보여 줄지 */
export type PhoneVerificationError =
  /** 인증번호 칸 아래 (clearCode면 입력칸도 비운다) */
  | { type: 'code'; message: string; clearCode: boolean }
  /** 인증 영역 안내 상자 (재발송 제한·요청 제한·번호 형식) */
  | { type: 'notice'; message: string }
  /** 이미 인증된 번호: 내 정보를 다시 불러와 인증됨으로 보여 준다 */
  | { type: 'already-verified' }
  /** 503·네트워크 등: 토스트 */
  | { type: 'toast'; message: string };

/** 서버 에러 코드별 화면 문구 */
const ERROR_BY_CODE: Record<string, PhoneVerificationError> = {
  PHONE_CODE_COOLDOWN: { type: 'notice', message: '1분 뒤에 다시 받을 수 있어요.' },
  PHONE_CODE_DAILY_LIMIT: { type: 'notice', message: '오늘은 인증번호를 더 받을 수 없어요.' },
  PHONE_CODE_TRIES_EXCEEDED: {
    type: 'code',
    message: '여러 번 틀렸어요. 인증번호를 다시 받아 주세요.',
    clearCode: true,
  },
  TOO_MANY_REQUESTS: { type: 'notice', message: '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.' },
  PHONE_ALREADY_VERIFIED: { type: 'already-verified' },
};

const CODE_INVALID_MESSAGE = '인증번호가 올바르지 않거나 만료되었습니다.';
const TOO_MANY_REQUESTS_FALLBACK: PhoneVerificationError = ERROR_BY_CODE.TOO_MANY_REQUESTS;

/**
 * 400 응답의 필드 오류를 인증 영역 표시로 바꾼다. 인증번호 칸 오류는 칸 아래, 그 밖(번호 형식 등)은 안내 상자.
 * @param error - 요청 에러
 * @returns 표시 방법 (필드 오류가 없으면 null)
 */
const parseFieldError = (error: unknown): PhoneVerificationError | null => {
  const [fieldError] = getFieldErrors(error);
  if (!fieldError) return null;
  if (fieldError.field === 'code') return { type: 'code', message: CODE_INVALID_MESSAGE, clearCode: false };
  return { type: 'notice', message: fieldError.reason };
};

/**
 * 휴대폰 인증번호 요청·확인 에러를 표시 방법별로 나눈다 (가입 전·내 정보 공용).
 * @param error - 요청 에러
 * @returns 표시 방법과 문구
 */
export const parsePhoneVerificationError = (error: unknown): PhoneVerificationError => {
  const code = getErrorCode(error);
  if (code && ERROR_BY_CODE[code]) return ERROR_BY_CODE[code];

  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  // gateway 요청 제한은 본문 코드 없이 올 수 있다
  if (status === 429) return TOO_MANY_REQUESTS_FALLBACK;
  if (status === 400) {
    const fieldError = parseFieldError(error);
    if (fieldError) return fieldError;
  }
  return { type: 'toast', message: getErrorMessage(error) };
};
