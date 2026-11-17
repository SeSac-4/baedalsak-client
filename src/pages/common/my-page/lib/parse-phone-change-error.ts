import axios from 'axios';

import { getErrorCode, getErrorMessage, getFieldErrors } from '@/shared/api';

/** 휴대폰 인증 필수 스위치가 켜져 있는데 인증 없이 바꾸려 할 때 서버 에러 코드 */
const VERIFICATION_REQUIRED_CODE = 'PHONE_CHANGE_VERIFICATION_REQUIRED';

/** 인증 없이 바꾸기 실패를 어디에 보여 줄지 */
export type PhoneUpdateError =
  /** 새 번호 칸 아래 (형식 오류 · 지금 번호와 같음) */
  | { type: 'phone'; message: string }
  /** 403: 인증해야 바꿀 수 있음 → 인증 흐름으로 안내 */
  | { type: 'verification-required'; message: string }
  /** 그 밖 (429 · 503 · 네트워크): 토스트 */
  | { type: 'toast'; message: string };

/**
 * 400 응답에서 새 번호 칸 오류(errors[phone])를 꺼낸다. 인증번호 받기 · 확인 · 인증 없이 바꾸기 공용.
 * @param error - 요청 에러
 * @returns 서버 문구 (번호 칸 오류가 없으면 null)
 */
export const getPhoneFieldError = (error: unknown): string | null => {
  if (!axios.isAxiosError(error) || error.response?.status !== 400) return null;
  const phoneError = getFieldErrors(error).find((fieldError) => fieldError.field === 'phone');
  return phoneError?.reason ?? null;
};

/**
 * 인증 없이 바꾸기(PATCH /members/me/phone) 에러를 표시 방법별로 나눈다.
 * @param error - 요청 에러
 * @returns 표시 방법과 문구
 */
export const parsePhoneUpdateError = (error: unknown): PhoneUpdateError => {
  const phoneMessage = getPhoneFieldError(error);
  if (phoneMessage) return { type: 'phone', message: phoneMessage };
  if (getErrorCode(error) === VERIFICATION_REQUIRED_CODE) {
    return { type: 'verification-required', message: getErrorMessage(error) };
  }
  return { type: 'toast', message: getErrorMessage(error) };
};
