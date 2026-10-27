import axios from 'axios';

import type { ApiErrorResponse, ApiFieldError } from './api-types';

/**
 * 400 VALIDATION_FAILED 응답의 필드별 오류를 꺼낸다.
 * @param error - 요청 중 발생한 에러
 * @returns 필드별 오류 목록 (없으면 빈 배열)
 */
export const getFieldErrors = (error: unknown): ApiFieldError[] => {
  if (!axios.isAxiosError<Partial<ApiErrorResponse>>(error)) return [];

  return error.response?.data?.errors ?? [];
};
