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

/** 내 정보 번호 변경: 새 번호 (인증번호 받기 · 인증 없이 바꾸기 공용 본문) */
export interface PhoneChangeRequest {
  /** 새 휴대폰 번호 (010 형식, 하이픈은 있어도 없어도 됨) */
  phone: string;
}

/** 내 정보 번호 변경: 새 번호로 받은 인증번호 확인 본문 */
export interface PhoneChangeConfirmRequest {
  /** 인증번호를 받은 새 번호 (서버는 코드를 보낸 번호와 같아야 맞다고 본다) */
  phone: string;
  /** 문자로 받은 숫자 6자리 */
  code: string;
}

/**
 * 내 번호를 바꾸려고 새 번호로 인증번호 문자를 보내 달라고 요청한다 (로그인 필요, 202). 지금 번호와 같으면 400 errors[phone].
 * @param request - 새 휴대폰 번호
 */
export const requestPhoneChangeCode = async (request: PhoneChangeRequest): Promise<void> => {
  await apiClient.post('/members/me/phone/change/code', request);
};

/**
 * 새 번호로 받은 인증번호를 확인하고 내 번호를 바꾼다 (로그인 필요, 204). 성공하면 새 번호가 인증됨이 된다.
 * @param request - 새 휴대폰 번호·인증번호
 */
export const confirmPhoneChange = async (request: PhoneChangeConfirmRequest): Promise<void> => {
  await apiClient.post('/members/me/phone/change/verify', request);
};

/**
 * 인증 없이 내 번호를 바꾼다 (로그인 필요, 204). 새 번호는 미인증이 된다. 서버 휴대폰 인증 필수 스위치가 켜져 있으면 403.
 * @param request - 새 휴대폰 번호
 */
export const updateMyPhone = async (request: PhoneChangeRequest): Promise<void> => {
  await apiClient.patch('/members/me/phone', request);
};
