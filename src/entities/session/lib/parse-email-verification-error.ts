import type { CodeVerificationError } from '../model/use-code-verifier';
import { parseCodeVerificationError, TOO_MANY_REQUESTS_ERROR } from './parse-code-verification-error';

/** 이메일 인증 서버 에러 코드별 화면 문구 */
const EMAIL_ERROR_BY_CODE: Readonly<Record<string, CodeVerificationError>> = {
  EMAIL_DUPLICATED: { type: 'notice', message: '이미 가입된 이메일이에요. 로그인하거나 다른 이메일을 입력해 주세요.' },
  EMAIL_CODE_COOLDOWN: { type: 'notice', message: '1분 뒤에 다시 받을 수 있어요.' },
  EMAIL_CODE_DAILY_LIMIT: { type: 'notice', message: '오늘은 이 이메일로 인증번호를 더 받을 수 없어요.' },
  EMAIL_CODE_TRIES_EXCEEDED: {
    type: 'code',
    message: '여러 번 틀렸어요. 인증번호를 다시 받아 주세요.',
    clearCode: true,
  },
  TOO_MANY_REQUESTS: TOO_MANY_REQUESTS_ERROR,
  DEPENDENCY_UNAVAILABLE: { type: 'notice', message: '인증 메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.' },
};

/**
 * 이메일 인증번호 요청·확인 에러를 표시 방법별로 나눈다 (가입 전).
 * 이미 가입된 이메일(409)은 코드 받기 단계에서 바로 오므로 인증 영역 안내 상자에 보여 준다.
 * @param error - 요청 에러
 * @returns 표시 방법과 문구
 */
export const parseEmailVerificationError = (error: unknown): CodeVerificationError =>
  parseCodeVerificationError(error, EMAIL_ERROR_BY_CODE);
