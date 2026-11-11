import axios from 'axios';

import { getErrorMessage, getFieldErrors, type ApiFieldError } from '@/shared/api';

/** 비밀번호 찾기·재설정 실패를 어디에 보여 줄지 */
export type PasswordResetError =
  /** 400: 필드 아래 */
  | { type: 'field'; fieldErrors: ApiFieldError[] }
  /** 429: 폼 안 안내 상자 */
  | { type: 'root'; message: string }
  /** 503·네트워크 등: 토스트 */
  | { type: 'toast'; message: string };

const TOO_MANY_REQUESTS_MESSAGE = '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.';

/**
 * 비밀번호 찾기·재설정 요청 에러를 표시 방법별로 나눈다.
 * 429는 요청 제한(IP당 1분 10번)이나 코드를 너무 많이 틀린 경우다.
 * @param error - 요청 에러
 * @returns 표시 방법과 문구
 */
export const parsePasswordResetError = (error: unknown): PasswordResetError => {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  if (status === 429) return { type: 'root', message: TOO_MANY_REQUESTS_MESSAGE };

  const fieldErrors = status === 400 ? getFieldErrors(error) : [];
  if (fieldErrors.length > 0) return { type: 'field', fieldErrors };

  return { type: 'toast', message: getErrorMessage(error) };
};
