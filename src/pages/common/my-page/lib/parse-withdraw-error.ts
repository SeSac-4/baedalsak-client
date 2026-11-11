import axios from 'axios';

import { getErrorCode, getErrorMessage } from '@/shared/api';

/**
 * 탈퇴 실패를 보여 줄 방법.
 * - not-allowed: 403 서버 문구를 확인 창 안내 상자에
 * - already-withdrawn: 404 이미 탈퇴 → 로그아웃처럼 로그인 화면으로
 * - session-expired: 401 → 공용 처리(세션 정리 · AuthGuard 이동)에 맡긴다
 * - toast: 503 등 일반 오류
 */
export type WithdrawError =
  | { type: 'not-allowed'; message: string }
  | { type: 'already-withdrawn' }
  | { type: 'session-expired' }
  | { type: 'toast'; message: string };

const NOT_ALLOWED_CODE = 'WITHDRAWAL_NOT_ALLOWED';

/**
 * 탈퇴 에러를 보여 줄 방법으로 나눈다.
 * @param error - 탈퇴 요청 에러
 * @returns 표시 방법과 문구
 */
export const parseWithdrawError = (error: unknown): WithdrawError => {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  if (status === 403 && getErrorCode(error) === NOT_ALLOWED_CODE) {
    return { type: 'not-allowed', message: getErrorMessage(error) };
  }
  if (status === 404) return { type: 'already-withdrawn' };
  if (status === 401) return { type: 'session-expired' };
  return { type: 'toast', message: getErrorMessage(error) };
};
