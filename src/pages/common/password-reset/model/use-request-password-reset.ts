import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { requestPasswordReset, type PasswordForgotRequest } from '../api/password-reset-api';

/**
 * 인증 코드 메일 요청 (1단계 제출·2단계 '코드 다시 받기' 공용).
 * @returns 인증 코드 요청 mutation
 */
export const useRequestPasswordReset = (): UseMutationResult<void, unknown, PasswordForgotRequest> =>
  useMutation({ mutationFn: requestPasswordReset });
