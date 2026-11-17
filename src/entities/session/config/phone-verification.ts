import type { MemberRole } from '../model/session-types';

/**
 * 휴대폰 인증 안내 문구 (가입 번호 칸 아래 · 내 정보 미인증 번호 아래). 서버 알림 문자가 역할마다 달라 문구도 다르다.
 * 고객: 주문 접수 · 픽업 · 배달 완료 문자 / 사장님: 새 주문 문자 (server #217) / 라이더: 문자 없음 → 안내 안 함(null)
 */
export const PHONE_VERIFICATION_HINT_BY_ROLE: Readonly<Record<MemberRole, string | null>> = {
  CUSTOMER: '문자 인증하면 주문 · 배달 알림을 문자로 받아 볼 수 있어요.',
  OWNER: '문자 인증하면 새 주문 알림을 문자로 받아 볼 수 있어요.',
  RIDER: null,
};

/** 인증번호 유효 시간 안내 (서버: 3분) */
export const PHONE_CODE_VALID_HINT = '문자로 받은 숫자 6자리를 3분 안에 입력해 주세요.';
