import type { ReactNode } from 'react';
import { Link, Outlet } from 'react-router';

import { useStoreOrderList, type OrderStatus } from '@/entities/order';
import { useMyStore, type StoreDetail } from '@/entities/store';
import { getErrorCode } from '@/shared/api';
import { NavPills, type NavPillItem } from '@/shared/ui/nav-pills';
import { StatusPill } from '@/shared/ui/status-pill';

const STORE_NOT_FOUND = 'STORE_NOT_FOUND';
const NEW_ORDER_STATUSES: OrderStatus[] = ['PAID'];
const MY_PAGE_NAV: NavPillItem = { to: '/me', label: '내 정보' };

/**
 * 가게가 있을 때 메뉴를 만든다.
 * @param newOrderCount - 주문 관리에 표시할 신규 주문 수
 * @returns 메뉴 항목
 */
const getStoreNav = (newOrderCount: number): NavPillItem[] => [
  { to: '/owner/orders', label: '주문 관리', count: newOrderCount },
  { to: '/owner/menus', label: '메뉴 관리' },
  { to: '/owner/store', label: '가게 관리', end: true },
  MY_PAGE_NAV,
];

/** 가게 등록 전 메뉴: 주문·메뉴 관리는 막고 가게 관리 자리에 가게 등록 */
const BEFORE_REGISTER_NAV: NavPillItem[] = [
  { to: '/owner/orders', label: '주문 관리', disabled: true },
  { to: '/owner/menus', label: '메뉴 관리', disabled: true },
  { to: '/owner/store/new', label: '가게 등록' },
  MY_PAGE_NAV,
];

/**
 * 헤더 오른쪽 가게 상태 표시를 만든다.
 * @param store - 내 가게 (없으면 undefined)
 * @param isBeforeRegister - 가게 등록 전 여부
 * @returns 상태 표시 요소 (확인 중이면 null)
 */
const renderStoreStatus = (store: StoreDetail | undefined, isBeforeRegister: boolean): ReactNode => {
  if (isBeforeRegister) return <StatusPill>가게 등록 전</StatusPill>;
  if (!store) return null;

  const isOpen = store.operationStatus === 'OPEN';
  return (
    <StatusPill
      dot={isOpen ? 'ok' : 'warn'}
      className='min-w-0'
    >
      <span className='truncate'>
        {store.name} · {isOpen ? '정상 운영' : '임시 중지'}
      </span>
    </StatusPill>
  );
};

/**
 * 사장님 화면 레이아웃. 헤더에 로고와 가게 상태를 두고, 메뉴는 PC에서 왼쪽 사이드(200px), 태블릿·모바일에서 헤더 아래 가로 줄로 둔다.
 * 가게 등록 전(GET /stores/me 404)에는 주문·메뉴 관리를 막고 가게 등록 메뉴를 보여 준다. 주문 관리에는 신규 주문 수를 표시한다.
 * @returns 레이아웃 요소
 */
export function OwnerLayout(): ReactNode {
  const { data: store, error } = useMyStore();
  const isBeforeRegister = getErrorCode(error) === STORE_NOT_FOUND;
  const { data: newOrders } = useStoreOrderList(store?.id ?? 0, NEW_ORDER_STATUSES);
  const navItems = isBeforeRegister ? BEFORE_REGISTER_NAV : getStoreNav(newOrders?.pages[0]?.totalElements ?? 0);

  return (
    <div className='flex min-h-dvh flex-col'>
      <header className='sticky top-0 z-20 border-b border-border bg-surface'>
        <div className='mx-auto flex min-h-14 w-full items-center gap-2.5 px-4 py-1.5 tablet:max-w-[760px] tablet:px-6 desktop:mx-0 desktop:max-w-none desktop:py-2'>
          <Link
            to={isBeforeRegister ? '/owner/store/new' : '/owner/orders'}
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
          {renderStoreStatus(store, isBeforeRegister)}
        </div>
        <NavPills
          label='사장님 메뉴'
          items={navItems}
          className='px-3 pb-2 tablet:mx-auto tablet:max-w-[760px] tablet:px-5 desktop:hidden'
        />
      </header>
      <div className='flex flex-1'>
        <aside className='hidden w-50 shrink-0 border-r border-border bg-surface px-3 py-5 desktop:block'>
          <NavPills
            label='사장님 메뉴'
            orientation='vertical'
            items={navItems}
            className='sticky top-19'
          />
        </aside>
        <main className='w-full min-w-0 px-4 pt-4 pb-6 tablet:mx-auto tablet:max-w-[760px] tablet:px-6 tablet:pt-5 tablet:pb-10 desktop:mx-0 desktop:max-w-[1080px] desktop:px-10 desktop:pt-7 desktop:pb-12'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
