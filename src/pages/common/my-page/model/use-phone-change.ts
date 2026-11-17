import { useState } from 'react';

import {
  confirmPhoneChange,
  parsePhoneVerificationError,
  phoneSchema,
  requestPhoneChangeCode,
  updateMyPhone,
  useCodeVerifier,
  type CodeVerificationError,
  type CodeVerifier,
} from '@/entities/session';
import { useToast } from '@/shared/ui/toast';

import { PHONE_CHANGE_VERIFICATION_REQUIRED } from '../config/phone-change';
import { getPhoneFieldError, parsePhoneUpdateError } from '../lib/parse-phone-change-error';

export interface PhoneChangeOptions {
  /**
   * 번호를 바꾼 뒤 처리 (토스트 · 내 정보 다시 불러오기 · 편집 닫기). 끝날 때까지 버튼을 막는다.
   * @param isVerified - 인증하고 바꿨으면 true, 인증 없이 바꿨으면 false
   */
  onChanged: (isVerified: boolean) => Promise<void>;
}

/** 내 정보 번호 변경 상태 */
export interface PhoneChange {
  /** 새 번호 입력값 */
  newPhone: string;
  /** 새 번호 칸 아래 오류 (형식 · 지금 번호와 같음) */
  phoneError: string | null;
  /** 새 번호로 받는 인증번호 흐름 (받기 버튼은 형식부터 확인한다) */
  verifier: CodeVerifier;
  /** [인증 없이 바꾸기]를 보여 줄지 (스위치가 꺼져 있고, 서버가 403을 주지 않았을 때) */
  canSkipVerification: boolean;
  /** 인증 없이 바꾸기 · 바꾼 뒤 처리 중 */
  isUpdating: boolean;
  /** 새 번호 입력값을 바꾼다. 인증번호를 받은 뒤 바꾸면 인증 흐름을 처음으로 되돌린다 */
  handlePhoneChange: (value: string) => void;
  /** 인증 없이 바로 바꾼다 */
  handleUpdateClick: () => Promise<void>;
}

/**
 * 내 정보(C-06) 휴대폰 번호 변경 흐름. 새 번호로 인증번호를 받아 확인하면 인증된 번호로 바뀌고,
 * 서버 스위치가 꺼져 있으면(PHONE_CHANGE_VERIFICATION_REQUIRED = false) 인증 없이 미인증 번호로 바꿀 수도 있다.
 * @param options - onChanged(바꾼 뒤 처리)
 * @returns 번호 변경 상태와 핸들러
 */
export const usePhoneChange = ({ onChanged }: PhoneChangeOptions): PhoneChange => {
  const toast = useToast();
  const [newPhone, setNewPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  /** 스위치 상수와 서버가 어긋나 403을 받으면 인증 흐름만 남긴다 */
  const [isVerificationForced, setIsVerificationForced] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  /**
   * 인증번호 받기·확인 에러를 나눈다. 새 번호 칸 오류(errors[phone])는 칸 아래에 직접 보여 주고, 나머지는 휴대폰 인증과 같다.
   * @param error - 요청 에러
   * @returns 표시 방법
   */
  const parseError = (error: unknown): CodeVerificationError => {
    const phoneMessage = getPhoneFieldError(error);
    if (!phoneMessage) return parsePhoneVerificationError(error);
    setPhoneError(phoneMessage);
    return { type: 'handled' };
  };

  /**
   * 인증하고 바꾸기 성공 처리.
   */
  const handleVerified = (): void => {
    setIsUpdating(true);
    void onChanged(true).finally(() => setIsUpdating(false));
  };

  const verifier = useCodeVerifier<void>({
    requestCode: () => requestPhoneChangeCode({ phone: newPhone.trim() }),
    confirmCode: (code: string) => confirmPhoneChange({ phone: newPhone.trim(), code }),
    onVerified: handleVerified,
    parseError,
  });

  /**
   * 새 번호 형식이 맞는지 보고, 틀리면 칸 아래에 보여 준다.
   * @returns 형식이 맞으면 true
   */
  const validatePhone = (): boolean => {
    const result = phoneSchema.safeParse(newPhone);
    setPhoneError(result.success ? null : (result.error.issues[0]?.message ?? null));
    return result.success;
  };

  /** 형식을 먼저 확인하고 새 번호로 인증번호를 받는다 */
  const handleRequestClick = async (): Promise<void> => {
    if (!validatePhone()) return;
    await verifier.handleRequestClick();
  };

  /**
   * 새 번호 입력값을 바꾼다. 서버는 코드를 보낸 번호와 확인하는 번호가 같아야 맞다고 보므로, 받은 뒤 바꾸면 처음부터 다시 받게 한다.
   * @param value - 새 번호
   */
  const handlePhoneChange = (value: string): void => {
    setNewPhone(value);
    setPhoneError(null);
    if (verifier.isSent) verifier.reset();
  };

  /** 인증 없이 바로 바꾼다. 403이면 서버 문구를 보여 주고 인증 흐름으로 안내한다 */
  const handleUpdateClick = async (): Promise<void> => {
    if (!validatePhone()) return;
    verifier.setNotice(null);
    setIsUpdating(true);
    try {
      await updateMyPhone({ phone: newPhone.trim() });
      await onChanged(false);
    } catch (error: unknown) {
      const parsed = parsePhoneUpdateError(error);
      if (parsed.type === 'phone') setPhoneError(parsed.message);
      else if (parsed.type === 'verification-required') {
        setIsVerificationForced(true);
        verifier.setNotice(parsed.message);
      } else toast(parsed.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    newPhone,
    phoneError,
    verifier: { ...verifier, handleRequestClick },
    canSkipVerification: !PHONE_CHANGE_VERIFICATION_REQUIRED && !isVerificationForced,
    isUpdating,
    handlePhoneChange,
    handleUpdateClick,
  };
};
