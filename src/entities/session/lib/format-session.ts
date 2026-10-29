import type { MemberRole, VehicleType } from '../model/session-types';

/** 회원 역할 표시명 */
export const MEMBER_ROLE_LABEL: Record<MemberRole, string> = {
  CUSTOMER: '고객',
  OWNER: '사장님',
  RIDER: '라이더',
};

/** 라이더 운송수단 표시명 */
export const VEHICLE_TYPE_LABEL: Record<VehicleType, string> = {
  WALK: '도보',
  MOTORCYCLE: '오토바이',
  BICYCLE: '자전거',
};
