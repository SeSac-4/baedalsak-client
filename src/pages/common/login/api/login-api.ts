import type { MemberRole } from '@/entities/session';
import { apiClient } from '@/shared/api';

import type { LoginFormValues } from '../model/login-schema';

/** 로그인 요청 본문 (API 명세 8.2.1 LoginRequest) */
export type LoginRequest = LoginFormValues;

/** 로그인 응답 본문. 토큰은 본문이 아니라 HttpOnly 쿠키로 온다 */
export interface LoginResponse {
  memberId: number;
  role: MemberRole;
}

/**
 * 이메일·비밀번호로 로그인한다. 이메일이 없거나 비밀번호가 틀리면 401.
 * @param request - 이메일·비밀번호
 * @returns 회원 ID·역할
 */
export const loginMember = async (request: LoginRequest): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', request);
  return data;
};
