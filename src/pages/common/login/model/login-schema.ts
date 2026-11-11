import { z } from 'zod';

import { emailSchema } from '@/entities/session';

/** 로그인 폼 검증 (서버 규칙: 이메일 형식·255자 이하, 비밀번호 50자 이하. 비밀번호 규칙은 가입에서만 검사) */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해 주세요.').max(50, '비밀번호는 50자 이하로 입력해 주세요.'),
});

/** 로그인 폼 값 */
export type LoginFormValues = z.infer<typeof loginSchema>;
