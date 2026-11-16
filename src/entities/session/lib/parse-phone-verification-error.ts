import type { CodeVerificationError } from '../model/use-code-verifier';
import { parseCodeVerificationError, TOO_MANY_REQUESTS_ERROR } from './parse-code-verification-error';

/** 휴대폰 인증 서버 에러 코드별 화면 문구 */
const PHONE_ERROR_BY_CODE: Readonly<Record<string, CodeVerificationError>> = {
  PHONE_CODE_COOLDOWN: { type: 'notice', message: '1분 뒤에 다시 받을 수 있어요.' },
  PHONE_CODE_DAILY_LIMIT: { type: 'notice', message: '오늘은 인증번호를 더 받을 수 없어요.' },
  PHONE_CODE_TRIES_EXCEEDED: {
    type: 'code',
    message: '여러 번 틀렸어요. 인증번호를 다시 받아 주세요.',
    clearCode: true,
  },
  TOO_MANY_REQUESTS: TOO_MANY_REQUESTS_ERROR,
  PHONE_ALREADY_VERIFIED: { type: 'already-verified' },
};

/**
 * 휴대폰 인증번호 요청·확인 에러를 표시 방법별로 나눈다 (가입 전·내 정보 공용).
 * @param error - 요청 에러
 * @returns 표시 방법과 문구
 */
export const parsePhoneVerificationError = (error: unknown): CodeVerificationError =>
  parseCodeVerificationError(error, PHONE_ERROR_BY_CODE);
