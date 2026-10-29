import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router';

import { getRoleHomePath, MEMBER_ROLE_LABEL, useMe, type MemberRole } from '@/entities/session';
import { cn } from '@/shared/lib/cn';

interface NavItem {
  to: string;
  label: string;
  /** 하위 경로에서는 강조하지 않음 (홈 메뉴) */
  end?: boolean;
}

const MY_PAGE_NAV: NavItem = { to: '/me', label: '내 정보' };

/** 역할별 상단 메뉴 */
const ROLE_NAV: Record<MemberRole, NavItem[]> = {
  CUSTOMER: [
    { to: '/', label: '가게', end: true },
    { to: '/orders', label: '주문내역' },
    { to: '/payments', label: '결제내역' },
    { to: '/cart', label: '장바구니' },
    MY_PAGE_NAV,
  ],
  OWNER: [
    { to: '/owner/orders', label: '주문 관리' },
    { to: '/owner/menus', label: '메뉴 관리' },
    { to: '/owner/store', label: '가게 관리' },
    MY_PAGE_NAV,
  ],
  RIDER: [{ to: '/rider', label: '배차 대기', end: true }, { to: '/rider/active', label: '진행 중 배달' }, MY_PAGE_NAV],
};

/**
 * 메뉴 링크 클래스를 구한다. 현재 화면이면 역할색으로 강조한다.
 * @param state - NavLink 상태
 * @returns 클래스 문자열
 */
const getNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
  cn(
    'rounded-lg px-2.5 py-1.5 text-body whitespace-nowrap transition hover:bg-surface-hover',
    isActive ? 'font-bold text-role' : 'text-fg-muted',
  );

/**
 * 로그인 후 화면 공통 레이아웃. 역할 강조색(--rc)을 data-role로 지정하고 역할별 메뉴(내 정보 포함)를 둔다.
 * AuthGuard 안쪽에서만 쓴다.
 * @returns 레이아웃 요소
 */
export function RoleLayout(): ReactNode {
  const { data: me } = useMe();
  if (!me) return <Outlet />;

  return (
    <div
      data-role={me.role}
      className='min-h-dvh'
    >
      <header className='sticky top-0 z-10 border-b border-border bg-surface'>
        <div className='mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2'>
          <NavLink
            to={getRoleHomePath(me.role)}
            className='flex items-baseline gap-1.5'
          >
            <span className='text-[1.125rem] font-bold text-role'>배달싹</span>
            <span className='text-note text-fg-muted'>{MEMBER_ROLE_LABEL[me.role]}</span>
          </NavLink>
          <nav
            aria-label='주 메뉴'
            className='-mx-2.5 flex flex-1 gap-1 overflow-x-auto tablet:mx-0 tablet:justify-end'
          >
            {ROLE_NAV[me.role].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={getNavLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
