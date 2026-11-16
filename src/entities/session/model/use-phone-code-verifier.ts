import { parsePhoneVerificationError } from '../lib/parse-phone-verification-error';
import { useCodeVerifier, type CodeVerifier, type CodeVerifierOptions } from './use-code-verifier';

/** 휴대폰 인증 옵션 (에러 나누기는 휴대폰 에러 코드로 고정) */
export type PhoneCodeVerifierOptions<T> = Omit<CodeVerifierOptions<T>, 'parseError' | 'codeFormatMessage'>;

/**
 * 휴대폰 문자 인증번호 흐름 (가입 · 내 정보 공용). 공용 useCodeVerifier에 휴대폰 에러 코드 해석을 붙인다.
 * @param options - requestCode(문자 요청), confirmCode(확인), onVerified(성공 처리), onAlreadyVerified(이미 인증됨 처리)
 * @returns 인증 상태와 핸들러
 */
export const usePhoneCodeVerifier = <T>(options: PhoneCodeVerifierOptions<T>): CodeVerifier =>
  useCodeVerifier<T>({ ...options, parseError: parsePhoneVerificationError });
