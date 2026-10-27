import axios from 'axios';

import type { ApiErrorResponse } from './api-types';

/**
 * 에러 응답의 서버 에러 코드를 꺼낸다. (예: CART_DIFFERENT_STORE)
 * @param error - 요청 중 발생한 에러
 * @returns 에러 코드 (서버 응답이 없거나 코드가 없으면 null)
 */
export const getErrorCode = (error: unknown): string | null => {
  if (!axios.isAxiosError<Partial<ApiErrorResponse>>(error)) return null;

  return error.response?.data?.code ?? null;
};
