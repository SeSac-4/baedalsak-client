import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { sessionKeys } from '@/entities/session';

import { signupMember, type SignupRequest, type SignupResponse } from '../api/signup-api';

/**
 * 회원 가입. 가입하면 바로 로그인 상태라 내 정보를 다시 받아 둔다(이동한 화면의 가드가 바로 쓰도록).
 * @returns 가입 mutation
 */
export const useSignup = (): UseMutationResult<SignupResponse, unknown, SignupRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signupMember,
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: sessionKeys.me(), refetchType: 'all' });
    },
  });
};
