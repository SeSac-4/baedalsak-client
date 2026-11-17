import { useState } from 'react';

import { useCountdown } from '@/shared/lib/use-countdown';
import { useToast } from '@/shared/ui/toast';

/** 인증번호를 다시 받을 수 있을 때까지 기다리는 시간(초). 서버 PHONE_CODE_COOLDOWN · EMAIL_CODE_COOLDOWN과 같다 */
export const CODE_RESEND_SECONDS = 60;

const CODE_PATTERN = /^\d{6}$/;
const DEFAULT_CODE_FORMAT_MESSAGE = '문자로 받은 숫자 6자리를 입력해 주세요.';

/** 인증 실패를 어디에 어떻게 보여 줄지 (휴대폰 · 이메일 공용) */
export type CodeVerificationError =
  /** 인증번호 칸 아래 (clearCode면 입력칸도 비운다) */
  | { type: 'code'; message: string; clearCode: boolean }
  /** 인증 영역 안내 상자 (재발송 제한·요청 제한·형식 오류 등) */
  | { type: 'notice'; message: string }
  /** 이미 인증됨: 쓰는 쪽이 정보를 다시 불러와 인증됨으로 보여 준다 */
  | { type: 'already-verified' }
  /** 503·네트워크 등: 토스트 */
  | { type: 'toast'; message: string }
  /** 쓰는 쪽이 이미 보여 줌 (예: 내 정보 번호 변경의 errors[phone]은 새 번호 칸 아래) */
  | { type: 'handled' };

export interface CodeVerifierOptions<T> {
  /** 인증번호 요청 (휴대폰 문자 · 이메일) */
  requestCode: () => Promise<void>;
  /** 인증번호 확인 */
  confirmCode: (code: string) => Promise<T>;
  /** 확인 성공 처리 (가입: 표 저장 · 내 정보: 내 정보 다시 불러오기) */
  onVerified: (result: T) => void;
  /** 409 이미 인증됨 처리 (내 정보 다시 불러오기) */
  onAlreadyVerified?: () => void;
  /** 요청·확인 에러를 표시 방법으로 나눈다 (휴대폰 · 이메일 에러 코드가 달라 쓰는 쪽이 넘긴다) */
  parseError: (error: unknown) => CodeVerificationError;
  /** 6자리가 아닐 때 칸 아래 문구 (기본: 문자로 받은 숫자 6자리를 입력해 주세요.) */
  codeFormatMessage?: string;
}

/** 인증번호 요청·입력·확인 상태 (휴대폰 가입·내 정보 · 이메일 가입 공용) */
export interface CodeVerifier {
  /** 인증번호를 보내서 입력칸을 보여 주는 중 */
  isSent: boolean;
  /** 입력한 인증번호 */
  code: string;
  /** 인증번호 칸 아래 오류 */
  codeError: string | null;
  /** 인증 영역 안내 상자 (재발송 제한·요청 제한 등) */
  notice: string | null;
  /** 다시 받기까지 남은 초 (0이면 바로 받을 수 있음) */
  resendSeconds: number;
  isRequesting: boolean;
  isConfirming: boolean;
  /** 인증번호 입력값을 바꾼다 */
  setCode: (code: string) => void;
  /** 안내 상자 문구를 바꾼다 (요청 전 번호 형식 확인 등) */
  setNotice: (message: string | null) => void;
  /** 인증번호 받기·다시 받기 */
  handleRequestClick: () => Promise<void>;
  /** 인증번호 확인 */
  handleConfirmClick: () => Promise<void>;
  /** 처음 상태로 되돌린다 (가입 화면에서 번호·이메일을 바꿨을 때) */
  reset: () => void;
}

/**
 * 인증번호를 받고 확인하는 흐름 (휴대폰 문자 · 이메일 공용). 다시 받기 60초 카운트다운과 에러 표시(칸 아래·안내 상자·토스트)를 맡는다.
 * 인증됨 여부는 화면마다 기준이 달라(가입: 표 · 내 정보: phoneVerified) 쓰는 쪽이 정한다.
 * @param options - requestCode(요청), confirmCode(확인), onVerified(성공 처리), onAlreadyVerified(이미 인증됨 처리), parseError(에러 나누기), codeFormatMessage(6자리 아님 문구)
 * @returns 인증 상태와 핸들러
 */
export const useCodeVerifier = <T>({
  requestCode,
  confirmCode,
  onVerified,
  onAlreadyVerified,
  parseError,
  codeFormatMessage = DEFAULT_CODE_FORMAT_MESSAGE,
}: CodeVerifierOptions<T>): CodeVerifier => {
  const toast = useToast();
  const resendCountdown = useCountdown();
  const [isSent, setIsSent] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  /** 처음 상태로 되돌린다 */
  const reset = (): void => {
    setIsSent(false);
    setCode('');
    setCodeError(null);
    setNotice(null);
    resendCountdown.stop();
  };

  /**
   * 에러를 표시 방법에 맞게 보여 준다.
   * @param parsed - 나눈 에러
   */
  const showError = (parsed: CodeVerificationError): void => {
    if (parsed.type === 'handled') return;
    if (parsed.type === 'code') {
      setCodeError(parsed.message);
      if (parsed.clearCode) setCode('');
      return;
    }
    if (parsed.type === 'notice') {
      setNotice(parsed.message);
      return;
    }
    if (parsed.type === 'already-verified') {
      reset();
      onAlreadyVerified?.();
      return;
    }
    toast(parsed.message);
  };

  /** 인증번호 문자를 요청하고, 성공하면 입력칸을 열고 다시 받기 카운트다운을 시작한다 */
  const handleRequestClick = async (): Promise<void> => {
    setNotice(null);
    setCodeError(null);
    setIsRequesting(true);
    try {
      await requestCode();
      setIsSent(true);
      setCode('');
      resendCountdown.start(CODE_RESEND_SECONDS);
    } catch (error: unknown) {
      showError(parseError(error));
    } finally {
      setIsRequesting(false);
    }
  };

  /** 6자리인지 먼저 보고 인증번호를 확인한다. 성공하면 입력칸을 닫는다 */
  const handleConfirmClick = async (): Promise<void> => {
    setNotice(null);
    const trimmedCode = code.trim();
    if (!CODE_PATTERN.test(trimmedCode)) {
      setCodeError(codeFormatMessage);
      return;
    }
    setCodeError(null);
    setIsConfirming(true);
    try {
      const result = await confirmCode(trimmedCode);
      reset();
      onVerified(result);
    } catch (error: unknown) {
      showError(parseError(error));
    } finally {
      setIsConfirming(false);
    }
  };

  return {
    isSent,
    code,
    codeError,
    notice,
    resendSeconds: resendCountdown.seconds,
    isRequesting,
    isConfirming,
    setCode,
    setNotice,
    handleRequestClick,
    handleConfirmClick,
    reset,
  };
};
