import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';

import { useMe } from '@/entities/session';
import { getErrorMessage } from '@/shared/api';
import { EmptyState } from '@/shared/ui/empty-state';

import { RoutePending } from './route-pending';

const LOGIN_PATH = '/login';

/**
 * 로그인 필요 화면 가드. 내 정보(useMe)가 null(비로그인·갱신 실패)이면 로그인으로 보낸다.
 * 세션이 끝나면 공용 axios가 me를 null로 바꾸므로 이 가드가 로그인 화면 이동도 맡는다.
 * @returns 하위 라우트 또는 이동·안내 요소
 */
export function AuthGuard(): ReactNode {
  const { data: me, error, isPending } = useMe();

  if (isPending) return <RoutePending />;

  if (error && me === undefined) {
    return (
      <div className='mx-auto max-w-[700px] px-4 py-6'>
        <EmptyState message={getErrorMessage(error)} />
      </div>
    );
  }

  if (!me) {
    return (
      <Navigate
        to={LOGIN_PATH}
        replace
      />
    );
  }

  return <Outlet />;
}
