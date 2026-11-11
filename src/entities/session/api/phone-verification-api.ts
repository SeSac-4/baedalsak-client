import { apiClient } from '@/shared/api';

/** 가입 전 인증번호 문자 요청 본문 */
export interface PhoneCodeRequest {
  phone: string;
}

/** 가입 전 인증번호 확인 본문 */
export interface PhoneCodeConfirmRequest {
  phone: string;
  /** 문자로 받은 숫자 6자리 */
  code: string;
}

/** 가입 전 인증번호 확인 응답. 가입 요청에 넣는 표 (10분 유효, 1회용, 인증한 번호에서만 통함) */
export interface PhoneCodeConfirmResponse {
  phoneVerificationToken: string;
}

/** 내 정보 인증번호 확인 본문 (번호는 서버가 DB의 내 번호를 쓴다) */
export interface MyPhoneCodeConfirmRequest {
  code: string;
}

/**
 * 가입 전, 입력한 번호로 인증번호 문자를 보내 달라고 요청한다 (로그인 없음, 202).
 * @param request - 휴대폰 번호
 */
export const requestPhoneCode = async (request: PhoneCodeRequest): Promise<void> => {
  await apiClient.post('/auth/phone/code', request);
};

/**
 * 가입 전, 문자로 받은 인증번호를 확인하고 가입 요청에 넣을 표를 받는다 (로그인 없음).
 * @param request - 휴대폰 번호·인증번호
 * @returns 휴대폰 인증 표
 */
export const confirmPhoneCode = async (request: PhoneCodeConfirmRequest): Promise<PhoneCodeConfirmResponse> => {
  const { data } = await apiClient.post<PhoneCodeConfirmResponse>('/auth/phone/verify', request);
  return data;
};

/**
 * 가입 후, DB에 저장된 내 번호로 인증번호 문자를 보내 달라고 요청한다 (로그인 필요, 202).
 */
export const requestMyPhoneCode = async (): Promise<void> => {
  await apiClient.post('/members/me/phone/code');
};

/**
 * 가입 후, 문자로 받은 인증번호로 내 번호를 인증한다 (로그인 필요, 204). 성공하면 내 정보의 phoneVerified가 true가 된다.
 * @param request - 인증번호
 */
export const confirmMyPhoneCode = async (request: MyPhoneCodeConfirmRequest): Promise<void> => {
  await apiClient.post('/members/me/phone/verify', request);
};
