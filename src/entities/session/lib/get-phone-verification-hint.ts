import { PHONE_VERIFICATION_HINT_BY_ROLE } from '../config/phone-verification';
import type { MemberRole } from '../model/session-types';

/**
 * 회원 유형에 맞는 휴대폰 인증 안내 문구를 고른다 (가입 · 내 정보 공용).
 * @param role - 회원 유형
 * @returns 안내 문구 (알림 문자가 없는 라이더는 null → 안내 줄을 그리지 않는다)
 */
export const getPhoneVerificationHint = (role: MemberRole): string | null => PHONE_VERIFICATION_HINT_BY_ROLE[role];
