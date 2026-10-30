import { getRoleHomePath, type MemberRole } from '@/entities/session';

/** 가입 직후 사장님은 가게가 없으므로 가게 등록(O-00)으로 바로 보낸다 */
const OWNER_STORE_CREATE_PATH = '/owner/store/new';

/**
 * 가입 직후 이동할 경로를 구한다. 고객 `/` · 사장님 `/owner/store/new` · 라이더 `/rider`.
 * @param role - 가입한 회원 역할
 * @returns 이동 경로
 */
export const getSignupDonePath = (role: MemberRole): string =>
  role === 'OWNER' ? OWNER_STORE_CREATE_PATH : getRoleHomePath(role);
