import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { clearSession } from '@/entities/session';

import { logoutMember } from '../api/logout-api';

/**
 * 로그아웃. 성공·실패와 관계없이 쿼리 캐시를 비우고 비로그인 상태로 둔다(서버는 항상 204).
 * @returns 로그아웃 mutation
 */
export const useLogout = (): UseMutationResult<void, unknown, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutMember,
    onSettled: (): void => clearSession(queryClient),
  });
};
