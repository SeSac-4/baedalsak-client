import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { confirmPasswordReset, type PasswordResetRequest } from '../api/password-reset-api';

/**
 * 새 비밀번호 확정. 로그인 전 화면이라 다시 받아 둘 내 정보가 없다.
 * @returns 비밀번호 재설정 mutation
 */
export const useConfirmPasswordReset = (): UseMutationResult<void, unknown, PasswordResetRequest> =>
  useMutation({ mutationFn: confirmPasswordReset });
