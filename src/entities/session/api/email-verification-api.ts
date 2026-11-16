import { apiClient } from '@/shared/api';

/** 가입 전 인증번호 메일 요청 본문 */
export interface EmailCodeRequest {
  email: string;
}

/** 가입 전 이메일 인증번호 확인 본문 */
export interface EmailCodeConfirmRequest {
  email: string;
  /** 메일로 받은 숫자 6자리 */
  code: string;
}

/** 가입 전 이메일 인증번호 확인 응답. 가입 요청에 넣는 표 (10분 유효, 1회용, 인증한 이메일에서만 통함) */
export interface EmailCodeConfirmResponse {
  emailVerificationToken: string;
}

/**
 * 가입 전, 입력한 이메일로 인증번호 메일을 보내 달라고 요청한다 (로그인 없음, 202). 이미 가입된 이메일이면 409.
 * @param request - 이메일
 */
export const requestEmailCode = async (request: EmailCodeRequest): Promise<void> => {
  await apiClient.post('/auth/email/code', request);
};

/**
 * 가입 전, 메일로 받은 인증번호를 확인하고 가입 요청에 넣을 표를 받는다 (로그인 없음).
 * @param request - 이메일·인증번호
 * @returns 이메일 인증 표
 */
export const confirmEmailCode = async (request: EmailCodeConfirmRequest): Promise<EmailCodeConfirmResponse> => {
  const { data } = await apiClient.post<EmailCodeConfirmResponse>('/auth/email/verify', request);
  return data;
};
