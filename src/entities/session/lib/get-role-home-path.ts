import type { MemberRole } from '../model/session-types';

/** 역할별 홈 경로. 사장님은 가게가 없으면 사장님 가드가 가게 등록(/owner/store/new)으로 보낸다 */
const ROLE_HOME_PATH: Record<MemberRole, string> = {
  CUSTOMER: '/',
  OWNER: '/owner/orders',
  RIDER: '/rider',
};

/**
 * 역할의 홈 경로를 구한다.
 * @param role - 회원 역할
 * @returns 홈 경로
 */
export const getRoleHomePath = (role: MemberRole): string => ROLE_HOME_PATH[role];
