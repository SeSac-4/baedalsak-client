import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

const STALE_TIME_MS = 60_000;
const MAX_QUERY_RETRY_COUNT = 2;

/**
 * 쿼리를 다시 시도할지 판단한다. 4xx는 다시 보내도 결과가 같아 재시도하지 않는다.
 * @param failureCount - 지금까지 실패한 횟수
 * @param error - 마지막 에러
 * @returns 재시도 여부
 */
const canRetryQuery = (failureCount: number, error: unknown): boolean => {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  if (status !== undefined && status >= 400 && status < 500) return false;

  return failureCount < MAX_QUERY_RETRY_COUNT;
};

/** 앱 전체에서 쓰는 QueryClient */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      retry: canRetryQuery,
    },
    mutations: {
      retry: false,
    },
  },
});
