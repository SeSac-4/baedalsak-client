import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { MEMBER_ROLE_LABEL, useMe, VEHICLE_TYPE_LABEL, type MemberMe } from '@/entities/session';
import { getErrorMessage } from '@/shared/api';
import { Badge } from '@/shared/ui/badge';
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
  { label: '이메일', value: me.email },
  { label: '이름', value: me.name },
  { label: '휴대폰 번호', value: me.phone },
  { label: '회원 유형', value: MEMBER_ROLE_LABEL[me.role] },
  ...(me.vehicleType ? [{ label: '운송수단', value: VEHICLE_TYPE_LABEL[me.vehicleType] }] : []),
];

/** 화면 틀: 모바일 16px · 태블릿 560px · PC 640px (시안 C-06) */
const PAGE_CLASS =
  'mx-auto flex w-full flex-col gap-3 px-4 pt-4 pb-6 tablet:max-w-[560px] tablet:gap-3.5 tablet:px-6 tablet:pt-5 tablet:pb-10 desktop:max-w-[640px] desktop:gap-4 desktop:px-10 desktop:pt-7 desktop:pb-12';

/**
 * 프로필 머리의 이니셜 (이름 첫 글자).
 * @param name - 회원 이름
 * @returns 첫 글자 (이름이 비었으면 빈 문자열)
 */
const getInitial = (name: string): string => name.trim().charAt(0);

/**
 * C-06 내 정보 화면. 프로필 머리(이니셜·이름·역할 배지) 아래 이메일·이름·휴대폰·역할을 보여 주고, 사장님은 내 가게 요약을 함께 보여 준다.
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
      <div className={PAGE_CLASS}>
        <EmptyState message={error ? getErrorMessage(error) : '로그인이 필요해요.'} />
      </div>
    );
  }

  return (
    <div className={PAGE_CLASS}>
      <PageHeader title='내 정보' />
      <Card
        role='region'
        aria-labelledby='me-account'
      >
        <div className='mb-4 flex items-center gap-3'>
          <span
            aria-hidden
            className='flex size-12 shrink-0 items-center justify-center rounded-full bg-role-soft font-bold text-role-ink'
          >
            {getInitial(me.name)}
          </span>
          <div className='flex flex-1 flex-col items-start leading-[1.4]'>
            <h2
              id='me-account'
              className='font-bold'
            >
              {me.name}
            </h2>
            <Badge tone='role'>{MEMBER_ROLE_LABEL[me.role]}</Badge>
          </div>
        </div>
        <KeyValueList
          items={getMemberItems(me)}
          labelWidth={110}
          className='gap-y-2.5 border-t border-border pt-3.5'
        />
      </Card>
      {me.role === 'OWNER' ? <OwnerStoreCard /> : null}
      <Button
        variant='secondary'
        size='lg'
        block
        disabled={isLoggingOut}
        onClick={handleLogoutClick}
      >
        로그아웃
      </Button>
    </div>
  );
}
