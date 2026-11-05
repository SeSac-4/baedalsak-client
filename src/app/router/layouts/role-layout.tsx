import type { ReactNode } from 'react';
import { Outlet } from 'react-router';

import { useMe } from '@/entities/session';
import { useDocumentRole } from '@/shared/lib/use-document-role';

import { CustomerLayout } from './customer-layout';
import { OwnerLayout } from './owner-layout';
import { RiderLayout } from './rider-layout';

/**
 * 로그인 후 화면 공통 레이아웃. 역할 강조색(--rc)을 data-role로 지정하고(모달·토스트용으로 <html>에도) 역할별 레이아웃을 고른다.
 * AuthGuard 안쪽에서만 쓴다.
 * @returns 레이아웃 요소
 */
export function RoleLayout(): ReactNode {
  const { data: me } = useMe();
  useDocumentRole(me?.role);
  if (!me) return <Outlet />;

  return (
    <div data-role={me.role}>
      {me.role === 'OWNER' ? <OwnerLayout /> : null}
      {me.role === 'CUSTOMER' ? <CustomerLayout /> : null}
      {me.role === 'RIDER' ? <RiderLayout me={me} /> : null}
    </div>
  );
}
