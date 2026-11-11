import { apiClient } from '@/shared/api';

/** 인증 코드 메일 요청 본문 */
export interface PasswordForgotRequest {
  email: string;
}

/** 새 비밀번호 설정 요청 본문. 비밀번호 확인 칸은 화면에서만 쓰고 보내지 않는다 */
export interface PasswordResetRequest {
  email: string;
  /** 메일로 받은 숫자 6자리 */
  code: string;
  newPassword: string;
}

/**
 * 비밀번호 재설정 인증 코드를 메일로 보내 달라고 요청한다.
 * 가입 여부를 숨기려고 서버는 가입하지 않은 이메일에도 항상 202(본문 없음)를 준다.
 * 이메일 형식 오류는 400, 요청이 많으면 429, 메일 서비스 장애는 503.
 * @param request - 이메일
 */
export const requestPasswordReset = async (request: PasswordForgotRequest): Promise<void> => {
  await apiClient.post('/auth/password/forgot', request);
};

/**
 * 메일로 받은 인증 코드로 새 비밀번호를 확정한다. 성공(204)하면 서버가 그 계정의 다른 기기를 모두 로그아웃시킨다.
 * 코드가 틀리거나 만료되면 400 errors[code], 비밀번호 규칙 위반은 400 errors[newPassword], 코드를 너무 많이 틀리면 429.
 * @param request - 이메일·인증 코드·새 비밀번호
 */
export const confirmPasswordReset = async (request: PasswordResetRequest): Promise<void> => {
  await apiClient.post('/auth/password/reset', request);
};
