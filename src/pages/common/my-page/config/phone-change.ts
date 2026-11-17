import type { MemberRole } from '@/entities/session';

/**
 * 내 정보 번호 변경 때 문자 인증 필수 여부. 서버 휴대폰 인증 필수 스위치(PHONE_VERIFICATION_REQUIRED)와 같은 값이어야 한다.
 * 지금 서버는 꺼져 있어(SMS 샌드박스) 인증 없이도 바꿀 수 있다. 서버가 켜지면 이 값만 true로 바꾸면 [인증 없이 바꾸기]가 사라진다.
 */
export const PHONE_CHANGE_VERIFICATION_REQUIRED = false;

/** 인증 없이 바꾸기 안내 (미인증 번호는 알림 문자가 가지 않는다). 받는 문자가 역할마다 달라 문구도 다르고, 문자가 없는 라이더는 null */
export const UNVERIFIED_PHONE_NOTICE_BY_ROLE: Readonly<Record<MemberRole, string | null>> = {
  CUSTOMER: '인증하지 않은 번호로는 주문 · 배달 알림 문자가 가지 않아요.',
  OWNER: '인증하지 않은 번호로는 새 주문 알림 문자가 가지 않아요.',
  RIDER: null,
};

/** 지금 번호가 인증돼 있을 때 덧붙이는 안내 (새 번호로 인증이 이어지지 않는다) */
export const VERIFICATION_RELEASE_NOTICE = '인증 없이 바꾸면 지금 번호의 인증이 해제돼요.';

/** 인증하고 바꿨을 때 토스트 */
export const PHONE_CHANGED_MESSAGE = '휴대폰 번호를 바꾸고 인증을 마쳤어요.';

/** 인증 없이 바꿨을 때 토스트 */
export const PHONE_CHANGED_UNVERIFIED_MESSAGE = '휴대폰 번호를 바꿨어요. 아직 인증하지 않은 번호예요.';
