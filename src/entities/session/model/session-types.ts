/** 회원 역할 */
export type MemberRole = 'CUSTOMER' | 'OWNER' | 'RIDER';

/** 라이더 운송수단 */
export type VehicleType = 'WALK' | 'MOTORCYCLE' | 'BICYCLE';

/** 내 정보 (GET /members/me, API 명세 8.3.1 MemberMe). 값이 없는 필드는 응답에서 빠진다 */
export interface MemberMe {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: MemberRole;
  /** 사장님만: 가입 때 입력한 가게 이름 (가게 등록 화면 기본값) */
  storeNameAtSignup?: string;
  /** 라이더만: 운송수단 */
  vehicleType?: VehicleType;
}
