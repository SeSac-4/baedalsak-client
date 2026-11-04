import type { ReactNode } from 'react';
import { Link, Outlet } from 'react-router';

import { useCart } from '@/entities/cart';
import { Icon } from '@/shared/ui/icon';
import { NavPills, type NavPillItem } from '@/shared/ui/nav-pills';

/** 고객 메뉴. 장바구니는 헤더 오른쪽 아이콘으로 들어간다 */
const CUSTOMER_NAV: NavPillItem[] = [
  { to: '/', label: '홈', end: true },
  { to: '/orders', label: '주문내역' },
  { to: '/payments', label: '결제내역' },
  { to: '/me', label: '내 정보' },
];

/**
 * 고객 화면 레이아웃. 헤더에 로고와 장바구니(담긴 개수)를 두고, 그 아래 메뉴를 가로로 둔다.
 * 본문 폭과 여백은 아직 페이지마다 정한다.
 * @returns 레이아웃 요소
 */
export function CustomerLayout(): ReactNode {
  const { data: cart } = useCart();
  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <div className='flex min-h-dvh flex-col'>
      <header className='sticky top-0 z-20 border-b border-border bg-surface'>
        <div className='mx-auto flex min-h-14 w-full items-center gap-2 px-4 py-1.5 tablet:max-w-[760px] tablet:px-6 desktop:max-w-none desktop:px-[max(40px,calc(50%-550px))] desktop:py-2'>
          <Link
            to='/'
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
          <Link
            to='/cart'
            aria-label={`장바구니, ${cartCount}개 담김`}
            className='relative flex size-11 items-center justify-center rounded-control text-fg transition hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink'
          >
            <Icon
              name='bag'
              size={22}
            />
            {cartCount > 0 ? (
              <span className='absolute top-1 right-0.5 h-4.5 min-w-4.5 rounded-full bg-role px-1.25 text-center text-[11px] leading-4.5 font-bold text-role-on tabular-nums'>
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
        <NavPills
          label='주요 메뉴'
          items={CUSTOMER_NAV}
          className='px-3 pb-2 tablet:mx-auto tablet:max-w-[760px] tablet:px-5 desktop:max-w-none desktop:px-[calc(max(40px,calc(50%-550px))-4px)] desktop:pb-2.5'
        />
      </header>
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  );
}
