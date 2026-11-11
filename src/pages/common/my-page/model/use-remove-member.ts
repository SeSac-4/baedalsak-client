import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { clearSession } from '@/entities/session';

import { removeMember } from '../api/withdraw-api';
import { parseWithdrawError } from '../lib/parse-withdraw-error';

/**
 * 회원 탈퇴. 탈퇴됐거나 이미 탈퇴(404)면 로그아웃처럼 쿼리 캐시를 비우고 비로그인 상태로 둔다(로그인 화면 이동은 AuthGuard).
 * 그 밖의 실패는 그대로 둔다.
 * @returns 탈퇴 mutation
 */
export const useRemoveMember = (): UseMutationResult<void, unknown, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeMember,
    onSuccess: (): void => clearSession(queryClient),
    onError: (error: unknown): void => {
      if (parseWithdrawError(error).type === 'already-withdrawn') clearSession(queryClient);
    },
  });
};
