import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { MEMBER_ROLE_LABEL, useMe, VEHICLE_TYPE_LABEL, type MemberMe } from '@/entities/session';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { KeyValueList, type KeyValueItem } from '@/shared/ui/key-value-list';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

import { useLogout } from '../model/use-logout';
import { OwnerStoreCard } from './owner-store-card';

const LOGIN_PATH = '/login';

/**
 * 내 정보를 라벨·값 목록으로 바꾼다. 라이더는 운송수단을 더한다.
 * @param me - 내 정보
 * @returns 라벨·값 목록
 */
const getMemberItems = (me: MemberMe): KeyValueItem[] => [
  { label: '이름', value: me.name },
  { label: '이메일', value: me.email },
  { label: '휴대폰', value: me.phone },
  { label: '회원 유형', value: MEMBER_ROLE_LABEL[me.role] },
  ...(me.vehicleType ? [{ label: '운송수단', value: VEHICLE_TYPE_LABEL[me.vehicleType] }] : []),
];

/**
 * C-06 내 정보 화면. 이름·이메일·휴대폰·역할을 보여 주고, 사장님은 내 가게 요약을 함께 보여 준다.
 * 로그아웃하면 캐시를 비우고 로그인 화면으로 간다.
 * @returns 내 정보 페이지
 */
export function MyPage(): ReactNode {
  const navigate = useNavigate();
  const { data: me, error, isPending } = useMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  /** 로그아웃하고 결과와 관계없이 로그인 화면으로 간다 */
  const handleLogoutClick = (): void => {
    logout(undefined, {
      onSettled: (): void => {
        void navigate(LOGIN_PATH, { replace: true });
      },
    });
  };

  if (isPending) {
    return (
      <div className='flex items-center justify-center gap-2 py-16 text-note text-fg-muted'>
        <Spinner label='내 정보 확인 중' />내 정보를 확인하고 있어요.
      </div>
    );
  }

  if (!me) {
    return (
      <div className='mx-auto max-w-[700px] px-4 py-6'>
        <EmptyState message={error ? getErrorMessage(error) : '로그인이 필요해요.'} />
      </div>
    );
  }

  return (
    <div className='mx-auto flex max-w-[560px] flex-col gap-4 px-4 py-6'>
      <PageHeader title='내 정보' />
      <Card className='flex flex-col gap-3'>
        <KeyValueList items={getMemberItems(me)} />
        <p className='text-note text-fg-muted'>로그인은 만료되면 자동으로 연장돼요.</p>
      </Card>
      {me.role === 'OWNER' ? <OwnerStoreCard /> : null}
      <div>
        <Button
          variant='secondary'
          disabled={isLoggingOut}
          onClick={handleLogoutClick}
        >
          로그아웃
        </Button>
      </div>
    </div>
  );
}
