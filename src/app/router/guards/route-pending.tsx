import type { ReactNode } from 'react';

import { Spinner } from '@/shared/ui/spinner';

/**
 * 가드가 로그인 상태를 확인하는 동안 보여 줄 로딩 화면.
 * @returns 로딩 요소
 */
export function RoutePending(): ReactNode {
  return (
    <div className='flex min-h-dvh items-center justify-center gap-2 text-note text-fg-muted'>
      <Spinner label='로그인 확인 중' />
      로그인 상태를 확인하고 있어요.
    </div>
  );
}
