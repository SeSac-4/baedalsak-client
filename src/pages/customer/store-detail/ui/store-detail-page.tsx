import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';

import { useCart } from '@/entities/cart';
import { useCategoryList } from '@/entities/category';
import { getStoreDefaultImage, useStore } from '@/entities/store';
import { getErrorMessage } from '@/shared/api';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { KeyValueList } from '@/shared/ui/key-value-list';
import { Notice } from '@/shared/ui/notice';
import { Spinner } from '@/shared/ui/spinner';
import { Thumbnail } from '@/shared/ui/thumbnail';

import { MenuListCard } from './menu-list-card';
import { StoreCartBar } from './store-cart-bar';
import { StoreCartSummary } from './store-cart-summary';
import { StoreHoursToggle } from './store-hours-toggle';

const HOME_LINK_CLASS = 'text-note font-medium text-role-ink hover:underline';
const PAGE_CLASS =
  'mx-auto flex w-full flex-col gap-3 px-4 pt-1 pb-6 tablet:max-w-[760px] tablet:gap-3.5 tablet:px-6 tablet:pb-10 desktop:max-w-[1180px] desktop:gap-4 desktop:px-10 desktop:pt-7 desktop:pb-12';

/**
 * U-02 가게 상세·메뉴 화면. 가게 정보·영업시간·메뉴 목록(담기)과 내 장바구니 요약(PC 오른쪽, 태블릿·모바일 아래 고정)을 보여 준다.
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
      <div className={PAGE_CLASS}>
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
    <>
      <div className={PAGE_CLASS}>
        <Link
          to='/'
          className='inline-flex min-h-11 items-center self-start text-note text-fg-muted hover:text-fg'
        >
          ‹ 가게 목록
        </Link>

        <div className='flex flex-col gap-3 tablet:gap-3.5 desktop:grid desktop:grid-cols-[minmax(0,1fr)_340px] desktop:items-start desktop:gap-6'>
          <div className='flex min-w-0 flex-col gap-3 tablet:gap-3.5 desktop:gap-4'>
            <Card padding='none'>
              <Thumbnail
                src={store.imageUrl}
                fallbackSrc={getStoreDefaultImage(store.category)}
                alt={`${store.name} 가게 대표 사진`}
                placeholderLabel='가게 대표 사진'
                className='h-45 w-full rounded-none border-b border-border'
              />
              <div className='flex flex-col gap-3 p-5'>
                <div className='flex flex-wrap items-center gap-2'>
                  <h1 className='text-title font-bold text-fg'>{store.name}</h1>
                  <Badge tone={store.isOpenNow ? 'ok' : 'muted'}>{store.isOpenNow ? '영업중' : '영업 종료'}</Badge>
                </div>
                <KeyValueList
                  labelWidth={92}
                  items={[
                    { label: '카테고리', value: categoryName },
                    { label: '최소주문', value: formatPrice(store.minOrderAmount) },
                    { label: '배달비', value: formatPrice(store.deliveryFee) },
                  ]}
                />
                <StoreHoursToggle store={store} />
              </div>
            </Card>

            {store.isOpenNow ? null : (
              <Notice tone='warn'>지금은 주문할 수 없어요. 정상 운영이면서 영업시간 안일 때만 주문이 들어가요.</Notice>
            )}

            <MenuListCard
              store={store}
              cart={cart}
            />
          </div>

          {cart ? (
            <aside
              aria-label='장바구니 요약'
              className='hidden desktop:sticky desktop:top-30 desktop:block'
            >
              <StoreCartSummary cart={cart} />
            </aside>
          ) : null}
        </div>
      </div>
      {cart ? <StoreCartBar cart={cart} /> : null}
    </>
  );
}
