import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { sessionKeys } from '@/entities/session';

import { loginMember, type LoginRequest, type LoginResponse } from '../api/login-api';

/**
 * 로그인. 성공하면 내 정보를 화면에 붙어 있지 않아도 다시 받아 둔다(이동한 화면의 가드가 바로 쓰도록).
 * @returns 로그인 mutation
 */
export const useLogin = (): UseMutationResult<LoginResponse, unknown, LoginRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginMember,
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: sessionKeys.me(), refetchType: 'all' });
    },
  });
};
