import type { MemberRole } from '@/entities/session';
import { apiClient } from '@/shared/api';

import { parseSignupBody } from '../lib/parse-signup-body';
import type { SignupCommonValues, SignupOwnerValues, SignupRiderValues } from '../model/signup-schema';

/** 역할별 가입 경로. 역할은 경로로 정해져 본문에 role을 넣지 않는다 (API 명세 8.1.1~8.1.3) */
const SIGNUP_PATH: Record<MemberRole, string> = {
  CUSTOMER: '/auth/signup/customer',
  OWNER: '/auth/signup/owner',
  RIDER: '/auth/signup/rider',
};

/** 가입 요청 공통: 휴대폰 인증 표 (선택). 있으면 인증된 회원, 없으면 미인증 회원으로 가입된다 */
interface SignupPhoneToken {
  phoneVerificationToken?: string;
}

/** 가입 요청 (역할 + 역할별 폼 값 + 휴대폰 인증 표). 비밀번호 확인은 보내기 전에 뺀다 */
export type SignupRequest = SignupPhoneToken &
  (
    | { role: 'CUSTOMER'; body: SignupCommonValues }
    | { role: 'OWNER'; body: SignupOwnerValues }
    | { role: 'RIDER'; body: SignupRiderValues }
  );

/** 가입 응답 본문 (로그인 응답과 같은 모양). 토큰은 본문이 아니라 HttpOnly 쿠키로 온다 */
export interface SignupResponse {
  memberId: number;
  role: MemberRole;
}

/**
 * 역할별로 회원 가입한다. 성공(201)하면 서버가 로그인 쿠키까지 발급한다.
 * 이메일 중복은 409 EMAIL_DUPLICATED, 입력 오류는 400 VALIDATION_FAILED (표가 만료·재사용·다른 번호면 errors[phoneVerificationToken]).
 * @param request - 역할·가입 정보·휴대폰 인증 표
 * @returns 회원 ID·역할
 */
export const signupMember = async ({ role, body, phoneVerificationToken }: SignupRequest): Promise<SignupResponse> => {
  const { data } = await apiClient.post<SignupResponse>(SIGNUP_PATH[role], {
    ...parseSignupBody(body),
    phoneVerificationToken,
  });
  return data;
};
