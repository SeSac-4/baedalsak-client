import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';

import { getRoleHomePath, useMe, type MemberRole } from '@/entities/session';

export interface RoleGuardProps {
  /** 이 라우트에 들어올 수 있는 역할 */
  role: MemberRole;
}

/**
 * 역할 가드. AuthGuard 안쪽에 두고, 역할이 맞지 않으면 내 역할 홈으로 보낸다.
 * 서버 역할 검사(403)는 gateway가 따로 하고, 이 가드는 화면 이동용이다.
 * @param props role(허용 역할)
 * @returns 하위 라우트 또는 이동 요소
 */
export function RoleGuard({ role }: RoleGuardProps): ReactNode {
  const { data: me } = useMe();

  if (me && me.role !== role) {
    return (
      <Navigate
        to={getRoleHomePath(me.role)}
        replace
      />
    );
  }

  return <Outlet />;
}
