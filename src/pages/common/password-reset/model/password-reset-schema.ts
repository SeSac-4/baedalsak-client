import { z } from 'zod';

import { emailSchema, passwordConfirmSchema, passwordSchema, PASSWORD_MISMATCH_MESSAGE } from '@/entities/session';

const CODE_PATTERN = /^\d{6}$/;

/** 1단계: 인증 코드를 받을 이메일 */
export const passwordForgotSchema = z.object({
  email: emailSchema,
});

/** 2단계: 인증 코드(숫자 6자리) + 새 비밀번호(가입과 같은 규칙) + 비밀번호 확인 */
export const passwordResetSchema = z
  .object({
    code: z.string().trim().regex(CODE_PATTERN, '메일로 받은 숫자 6자리를 입력해 주세요.'),
    newPassword: passwordSchema,
    newPasswordConfirm: passwordConfirmSchema,
  })
  .refine(({ newPassword, newPasswordConfirm }) => newPassword === newPasswordConfirm, {
    path: ['newPasswordConfirm'],
    message: PASSWORD_MISMATCH_MESSAGE,
  });

/** 1단계 폼 값 */
export type PasswordForgotValues = z.infer<typeof passwordForgotSchema>;

/** 2단계 폼 값 */
export type PasswordResetValues = z.infer<typeof passwordResetSchema>;
