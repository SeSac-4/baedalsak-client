import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import { useCart } from '@/entities/cart';
import { useCategoryList } from '@/entities/category';
import { StoreHoursCard, formatBusinessHour, useStore } from '@/entities/store';
import { getErrorMessage } from '@/shared/api';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';
import { CartSummaryCard } from '@/widgets/cart-summary';

import { MenuListCard } from './menu-list-card';

const HOME_LINK_CLASS = 'text-note font-medium text-role hover:underline';

/**
 * U-02 가게 상세·메뉴 화면. 가게 정보·요일별 영업시간·메뉴 목록(담기)과 내 장바구니를 보여 준다.
 * 없는 가게(404 STORE_NOT_FOUND)는 서버 메시지로 안내한다.
 * @returns 가게 상세 페이지
 */
export function StoreDetailPage(): ReactNode {
  const { storeId } = useParams<{ storeId: string }>();
  const { data: store, error, isPending } = useStore(Number(storeId));
  const { data: categories } = useCategoryList();
  const { data: cart } = useCart();

  if (isPending) {
    return (
      <div className='flex items-center justify-center gap-2 py-16 text-note text-fg-muted'>
        <Spinner label='가게 정보 불러오는 중' />
        가게 정보를 불러오고 있어요.
      </div>
    );
  }

  if (!store) {
    return (
      <div className='mx-auto max-w-[1100px] px-4 py-6'>
        <EmptyState
          message={error ? getErrorMessage(error) : '가게를 찾을 수 없어요.'}
          action={
            <Link
              to='/'
              className={HOME_LINK_CLASS}
            >
              가게 목록으로
            </Link>
          }
        />
      </div>
    );
  }

  const categoryName = categories?.find((item) => item.code === store.category)?.name ?? '';

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col gap-4 px-4 py-6'>
      <nav
        aria-label='경로'
        className='text-note text-fg-muted'
      >
        <Link
          to='/'
          className='hover:text-fg'
        >
          홈
        </Link>
        {' › '}
        {categoryName}
        {' › '}
        <span className='text-fg'>{store.name}</span>
      </nav>

      <div className='grid gap-4 tablet:grid-cols-[1fr_300px] tablet:items-start'>
        <div className='flex flex-col gap-4'>
          <Card className='flex flex-col gap-3'>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-title font-bold text-fg'>{store.name}</h2>
              <Badge tone={store.isOpenNow ? 'ok' : 'muted'}>{store.isOpenNow ? '영업중' : '영업 종료'}</Badge>
            </div>
            <p className='text-body text-fg-muted'>{store.address}</p>
            <div className='flex flex-wrap gap-x-4 gap-y-1 text-note text-fg-muted'>
              <span>
                오늘 영업 <b className='text-fg'>{formatBusinessHour(store.todayHour)}</b>
              </span>
              <span>
                최소주문 <b className='text-fg'>{formatPrice(store.minOrderAmount)}</b>
              </span>
              <span>
                배달비 <b className='text-fg'>{formatPrice(store.deliveryFee)}</b>
              </span>
            </div>
            <StoreHoursCard
              hours={store.businessHours}
              today={store.todayHour.dayOfWeek}
            />
          </Card>

          <section>
            <PageHeader title='메뉴' />
            <MenuListCard store={store} />
          </section>

          {store.isOpenNow ? null : (
            <p className='text-note text-warn'>
              지금은 주문할 수 없어요. 정상 운영이면서 영업시간 안일 때만 주문이 들어가요.
            </p>
          )}
        </div>

        <aside className='tablet:sticky tablet:top-4'>{cart ? <CartSummaryCard cart={cart} /> : null}</aside>
      </div>
    </div>
  );
}
