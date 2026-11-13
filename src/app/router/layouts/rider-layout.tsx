import type { ReactNode } from 'react';
import { Link, Outlet } from 'react-router';

import { useActiveDelivery, useRiderOnlineStore } from '@/entities/delivery';
import type { MemberMe } from '@/entities/session';
import { cn } from '@/shared/lib/cn';
import { NavPills, type NavPillItem } from '@/shared/ui/nav-pills';
import { StatusPill } from '@/shared/ui/status-pill';
import { Switch } from '@/shared/ui/switch';
import { useToast } from '@/shared/ui/toast';

const WAITING_LOCKED_MESSAGE = '배달을 마치면 배차 대기를 볼 수 있어요.';
const ONLINE_LOCKED_MESSAGE = '배달 중에는 운행을 끌 수 없어요.';

export interface RiderLayoutProps {
  me: MemberMe;
}

/**
 * 라이더 화면 레이아웃. 헤더에 로고와 라이더 이름 · 운행 상태를 두고, 그 아래 메뉴를 가로로 두며 오른쪽 끝에 운행 스위치를 둔다.
 * 본문 폭과 여백은 페이지마다 정한다.
 * @param props me(로그인한 라이더)
 * @returns 레이아웃 요소
 */
export function RiderLayout({ me }: RiderLayoutProps): ReactNode {
  const { isOnline, setOnline } = useRiderOnlineStore();
  const { data: activeDelivery } = useActiveDelivery();
  const toast = useToast();
  const isDelivering = Boolean(activeDelivery);
  const isOnlineLocked = isDelivering && isOnline;

  // 진행 중인 배달이 있으면 배차 대기 탭과 운행 스위치를 잠그고, 누르면 이유를 알린다
  const riderNav: NavPillItem[] = [
    {
      to: '/rider',
      label: '배차 대기',
      end: true,
      disabled: isDelivering,
      onDisabledClick: () => toast(WAITING_LOCKED_MESSAGE),
    },
    { to: '/rider/active', label: '진행 중 배달' },
    { to: '/rider/history', label: '배달 내역' },
    { to: '/me', label: '내 정보' },
  ];

  const handleOnlineChange = (checked: boolean): void => {
    if (isOnlineLocked) {
      toast(ONLINE_LOCKED_MESSAGE);
      return;
    }
    setOnline(checked);
  };

  return (
    <div className='flex min-h-dvh flex-col'>
      <header className='sticky top-0 z-20 border-b border-border bg-surface'>
        <div className='mx-auto flex min-h-14 w-full items-center gap-2.5 px-4 py-1.5 tablet:max-w-[760px] tablet:px-6 desktop:max-w-none desktop:px-[max(40px,calc(50%-550px))] desktop:py-2'>
          <Link
            to='/rider'
            className='flex min-h-11 shrink-0 items-center gap-1.5 rounded-control text-[18px] font-extrabold tracking-[-0.02em] text-role-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink'
          >
            <img
              src='/logo.png'
              alt=''
              className='size-7 object-contain'
            />
            배달싹
          </Link>
          <span className='flex-1' />
          <StatusPill
            dot={isOnline ? 'ok' : 'muted'}
            className='min-w-0'
          >
            <span className='truncate'>
              {me.name} · {isOnline ? '운행 중' : '쉬는 중'}
            </span>
          </StatusPill>
        </div>
        <div className='flex items-center gap-2 px-3 pb-2 tablet:mx-auto tablet:max-w-[760px] tablet:px-5 desktop:max-w-none desktop:px-[calc(max(40px,calc(50%-550px))-4px)] desktop:pb-2.5'>
          <NavPills
            label='주요 메뉴'
            items={riderNav}
            className='min-w-0 flex-1'
          />
          {/* 스위치만 있으면 무슨 스위치인지 몰라 글자를 함께 둔다. 이름은 스위치 aria-label이 읽어 주므로 글자는 숨긴다 */}
          <div className={cn('flex shrink-0 items-center gap-0.5', isOnlineLocked && 'opacity-50')}>
            <span
              aria-hidden
              className={cn('text-note font-semibold whitespace-nowrap', isOnline ? 'text-role-ink' : 'text-fg-muted')}
            >
              {isOnline ? '운행 중' : '운행 쉼'}
            </span>
            <Switch
              checked={isOnline}
              onCheckedChange={handleOnlineChange}
              label='운행'
              aria-disabled={isOnlineLocked}
            />
          </div>
        </div>
      </header>
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  );
}
