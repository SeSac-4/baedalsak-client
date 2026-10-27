import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';

import { useMyStore } from '@/entities/store';
import { getErrorCode, getErrorMessage } from '@/shared/api';
import { EmptyState } from '@/shared/ui/empty-state';
import { Spinner } from '@/shared/ui/spinner';

const STORE_NOT_FOUND = 'STORE_NOT_FOUND';
const STORE_CREATE_PATH = '/owner/store/new';

/**
 * 사장님 화면 가드. 내 가게(GET /stores/me)를 확인하고, 아직 없으면(404 STORE_NOT_FOUND) 가게 등록으로 보낸다.
 * 가게가 있으면 하위 라우트를 그대로 보여 준다.
 * @returns 하위 라우트 또는 이동·안내 요소
 */
export function OwnerStoreGuard(): ReactNode {
  const { data: store, error, isPending } = useMyStore();

  if (isPending) {
    return (
      <div className='flex items-center justify-center gap-2 py-16 text-note text-fg-muted'>
        <Spinner label='가게 정보 확인 중' />
        가게 정보를 확인하고 있어요.
      </div>
    );
  }

  if (getErrorCode(error) === STORE_NOT_FOUND) {
    return (
      <Navigate
        to={STORE_CREATE_PATH}
        replace
      />
    );
  }

  if (!store) {
    return (
      <div className='mx-auto max-w-[1100px] px-4 py-6'>
        <EmptyState message={getErrorMessage(error)} />
      </div>
    );
  }

  return <Outlet />;
}
