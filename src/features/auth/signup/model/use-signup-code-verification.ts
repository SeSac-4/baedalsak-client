import { useState } from 'react';
import type { ZodType } from 'zod';

import { useCodeVerifier, type CodeVerificationError, type CodeVerifier } from '@/entities/session';

/** 가입 화면 인증 설정 (휴대폰 · 이메일마다 다른 부분) */
export interface SignupCodeVerificationConfig {
  /** 인증번호 받기 전 입력값 형식 검사 */
  schema: ZodType<string>;
  /** 같은 값인지 비교할 때 쓰는 모양 (휴대폰: 숫자만 · 이메일: 공백 제거 + 소문자) */
  normalize: (value: string) => string;
  /** 인증번호 요청 */
  requestCode: (value: string) => Promise<void>;
  /** 인증번호 확인 → 가입 요청에 넣을 표 */
  confirmCode: (value: string, code: string) => Promise<string>;
  /** 요청·확인 에러 나누기 */
  parseError: (error: unknown) => CodeVerificationError;
  /** 6자리가 아닐 때 칸 아래 문구 */
  codeFormatMessage?: string;
  /** 가입 요청에서 표를 담는 서버 필드명 (가입 400 errors[]에서 이 필드면 인증을 푼다) */
  tokenField: string;
  /** 인증한 뒤 값을 바꿨을 때 안내 */
  changedMessage: string;
  /** 필수인데 인증하지 않고 가입하려 할 때 안내 */
  requiredMessage: string;
  /** 인증 필수 여부 */
  required: boolean;
}

/** 인증한 값과 그 값으로 받은 표 */
interface VerifiedValue {
  value: string;
  token: string;
}

/** 가입 화면 인증 상태 (휴대폰 · 이메일 공용) */
export interface SignupCodeVerification {
  /** 인증번호 받기·입력·확인 상태 (형식을 먼저 확인하는 받기 핸들러로 바꿔 둠) */
  verifier: CodeVerifier;
  /** 지금 입력한 값으로 인증됐는지 */
  isVerified: boolean;
  /** 가입 요청에 넣을 표 (인증 안 했으면 undefined) */
  token: string | undefined;
  /** 입력칸이 바뀔 때 호출한다. 인증(또는 요청)한 값과 다르면 인증 상태를 풀고 표를 버린다 */
  handleValueChange: (value: string) => void;
  /** 가입 요청의 필드 오류가 표 오류면 인증을 풀고 안내한 뒤 true를 돌려준다 */
  handleSignupFieldError: (field: string, message: string) => boolean;
  /** 인증 필수인데 인증 안 했으면 안내하고 false를 돌려준다 */
  validateRequired: () => boolean;
}

/**
 * 가입 화면(C-03~C-05) 인증 흐름 (휴대폰 · 이메일 공용). 인증하면 받은 표를 가입 요청에 넣는다.
 * 표는 인증한 값에서만 통하므로, 인증한 뒤 값을 바꾸면 인증 상태를 풀고 표를 버린다.
 * @param config - 휴대폰 · 이메일별 설정 (형식 검사 · 비교 모양 · API · 에러 · 문구 · 필수 여부)
 * @returns 가입 인증 상태와 핸들러
 */
export const useSignupCodeVerification = (config: SignupCodeVerificationConfig): SignupCodeVerification => {
  const [value, setValue] = useState<string>('');
  /** 마지막으로 인증번호를 요청한 값 (입력칸이 열린 동안 이 값과 비교) */
  const [requestedValue, setRequestedValue] = useState<string | null>(null);
  const [verified, setVerified] = useState<VerifiedValue | null>(null);

  const verifier = useCodeVerifier<string>({
    requestCode: () => config.requestCode(value.trim()),
    confirmCode: (code: string) => config.confirmCode(value.trim(), code),
    onVerified: (token: string): void => {
      setVerified({ value, token });
    },
    parseError: config.parseError,
    codeFormatMessage: config.codeFormatMessage,
  });

  /** 형식을 먼저 확인하고, 맞으면 인증번호를 요청한다 */
  const handleRequestClick = async (): Promise<void> => {
    const result = config.schema.safeParse(value);
    if (!result.success) {
      verifier.setNotice(result.error.issues[0]?.message ?? null);
      return;
    }
    setRequestedValue(value);
    await verifier.handleRequestClick();
  };

  /** 인증 상태를 풀고 표를 버린다 */
  const clearVerification = (): void => {
    setVerified(null);
    setRequestedValue(null);
    verifier.reset();
  };

  /**
   * 값이 인증(또는 요청)한 값과 달라지면 인증 상태를 풀고 표를 버린다.
   * @param nextValue - 바뀐 값
   */
  const handleValueChange = (nextValue: string): void => {
    setValue(nextValue);
    const targetValue = verified?.value ?? requestedValue;
    if (targetValue === null || config.normalize(targetValue) === config.normalize(nextValue)) return;

    const wasVerified = verified !== null;
    clearVerification();
    if (wasVerified) verifier.setNotice(config.changedMessage);
  };

  /**
   * 가입 요청의 표 오류(없음·만료·재사용·다른 값)면 인증을 풀고 인증 칸에 안내한다.
   * @param field - 서버 errors[].field
   * @param message - 보여 줄 문구
   * @returns 처리했으면 true
   */
  const handleSignupFieldError = (field: string, message: string): boolean => {
    if (field !== config.tokenField) return false;
    clearVerification();
    verifier.setNotice(message);
    return true;
  };

  /**
   * 인증 필수 설정이면 인증했는지 확인한다.
   * @returns 가입을 진행해도 되면 true
   */
  const validateRequired = (): boolean => {
    if (!config.required || verified !== null) return true;
    verifier.setNotice(config.requiredMessage);
    return false;
  };

  return {
    verifier: { ...verifier, handleRequestClick },
    isVerified: verified !== null,
    token: verified?.token,
    handleValueChange,
    handleSignupFieldError,
    validateRequired,
  };
};
