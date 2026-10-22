import axios from 'axios';

import type { ApiErrorResponse } from './api-types';

const DEFAULT_ERROR_MESSAGE = '요청을 처리하지 못했어요.';
const NETWORK_ERROR_MESSAGE = '네트워크 연결을 확인해 주세요.';
const SERVICE_UNAVAILABLE_MESSAGE = '잠시 후 다시 시도해 주세요.';

/**
 * 에러를 화면에 보여줄 메시지로 바꾼다.
 * @param error - 요청 중 발생한 에러
 * @returns 사용자에게 보여줄 메시지
 */
export const getErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) return DEFAULT_ERROR_MESSAGE;
  if (!error.response) return NETWORK_ERROR_MESSAGE;
  if (error.response.status === 503) return SERVICE_UNAVAILABLE_MESSAGE;

  return error.response.data?.message || DEFAULT_ERROR_MESSAGE;
};
