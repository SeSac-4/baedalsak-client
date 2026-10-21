import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { CART_MOCK } from '@/entities/cart';
import { CATEGORY_LIST_MOCK } from '@/entities/category';
import { STORE_DETAIL_MOCK, StoreHoursCard, formatBusinessHour } from '@/entities/store';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { CartSummaryCard } from '@/widgets/cart-summary';

/**
 * U-02 가게 상세·메뉴 화면. 가게 정보와 요일별 영업시간을 보여 주고,
 * 메뉴 목록은 자리만 둔다. (목 데이터)
 * @returns 가게 상세 페이지
 */
export function StoreDetailPage(): ReactNode {
  const store = STORE_DETAIL_MOCK;
  const categoryName = CATEGORY_LIST_MOCK.find((item) => item.code === store.category)?.name ?? '';

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
            <EmptyState message='메뉴 목록 영역 (menu 도메인에서 구현 예정)' />
          </section>

          {store.isOpenNow ? null : (
            <p className='text-note text-warn'>
              지금은 주문할 수 없어요. 정상 운영이면서 영업시간 안일 때만 주문이 들어가요.
            </p>
          )}
        </div>

        <aside className='tablet:sticky tablet:top-4'>
          <CartSummaryCard cart={CART_MOCK} />
        </aside>
      </div>
    </div>
  );
}
