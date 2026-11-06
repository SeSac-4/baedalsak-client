import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { useCart } from '@/entities/cart';
import { useStore } from '@/entities/store';
import { getErrorMessage } from '@/shared/api';
import { Button, getButtonClassName } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Notice } from '@/shared/ui/notice';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';
import { CartOrderBar, CartSummaryCard } from '@/widgets/cart-summary';

import { useClearCart } from '../model/use-clear-cart';

const PAGE_CLASS =
  'mx-auto flex w-full flex-col gap-3 px-4 pt-1 pb-6 tablet:max-w-[760px] tablet:gap-3.5 tablet:px-6 tablet:pt-5 tablet:pb-10 desktop:max-w-[1180px] desktop:gap-4 desktop:px-10 desktop:pt-7 desktop:pb-12';

/**
 * U-03 장바구니 화면. 내 장바구니(GET /cart)의 항목 수량·삭제, 결제 예상 금액, 최소주문 안내, 비우기를 보여 준다.
 * 영업 여부는 장바구니 응답에 없어 가게 상세로 확인한다. 확인 전에는 막지 않고, 주문 때 서버가 다시 검사한다.
 * @returns 장바구니 페이지
 */
export function CartPage(): ReactNode {
  const { data: cart, error, isPending } = useCart();
  const { data: store } = useStore(cart?.storeId ?? 0);
  const { mutate: clearCart, isPending: isClearing } = useClearCart();
  const hasItems = Boolean(cart && cart.items.length > 0);
  const isStoreOpen = store?.isOpenNow ?? true;

  return (
    <>
      <div className={PAGE_CLASS}>
        <div>
          {cart && hasItems ? (
            <Link
              to={`/stores/${cart.storeId}`}
              className='inline-flex min-h-11 items-center text-note text-fg-muted hover:text-fg'
            >
              ‹ {cart.storeName}
            </Link>
          ) : null}
          <PageHeader
            title='장바구니'
            actions={
              hasItems ? (
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={isClearing}
                  className='min-h-11 text-note text-fg-muted'
                  onClick={() => clearCart()}
                >
                  전체 비우기
                </Button>
              ) : null
            }
          />
        </div>

        {isPending ? (
          <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
            <Spinner label='장바구니 불러오는 중' />
            장바구니를 불러오고 있어요.
          </div>
        ) : null}

        {error ? <EmptyState message={getErrorMessage(error)} /> : null}

        {cart && hasItems && !isStoreOpen ? (
          <Notice
            tone='warn'
            role='alert'
          >
            지금은 가게 영업시간이 아니라 주문할 수 없어요. 영업이 시작되면 다시 주문해 주세요.
          </Notice>
        ) : null}

        {cart && hasItems ? (
          <CartSummaryCard
            cart={cart}
            isStoreOpen={isStoreOpen}
          />
        ) : null}

        {cart && !hasItems ? (
          <EmptyState
            icon='bag'
            message='장바구니가 비어 있어요'
            description='가게에서 메뉴를 담으면 여기에 모여요.'
            action={
              <Link
                to='/'
                className={getButtonClassName({ size: 'lg' })}
              >
                가게 둘러보기
              </Link>
            }
          />
        ) : null}
      </div>
      {cart && hasItems ? (
        <CartOrderBar
          cart={cart}
          isStoreOpen={isStoreOpen}
        />
      ) : null}
    </>
  );
}
