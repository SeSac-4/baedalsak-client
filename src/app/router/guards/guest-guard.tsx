import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';

import { getRoleHomePath, useMe } from '@/entities/session';

import { RoutePending } from './route-pending';

/**
 * 비로그인 화면(로그인·회원가입) 가드. 이미 로그인했으면 역할 홈으로 보낸다.
 * 내 정보 확인이 실패(503 등)하면 비로그인으로 보고 화면을 그대로 보여 준다.
 * @returns 하위 라우트 또는 이동 요소
 */
export function GuestGuard(): ReactNode {
  const { data: me, isPending } = useMe();

  if (isPending) return <RoutePending />;

  if (me) {
    return (
      <Navigate
        to={getRoleHomePath(me.role)}
        replace
      />
    );
  }

  return <Outlet />;
}
