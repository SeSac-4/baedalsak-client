import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { useCart } from '@/entities/cart';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';
import { CartSummaryCard } from '@/widgets/cart-summary';

import { useClearCart } from '../model/use-clear-cart';

const STORE_LIST_LINK_CLASS = 'text-note font-medium text-role hover:underline';

/**
 * U-03 장바구니 화면. 내 장바구니(GET /cart)의 항목 수량·삭제, 합계, 주문 불가 안내, 비우기를 보여 준다.
 * @returns 장바구니 페이지
 */
export function CartPage(): ReactNode {
  const { data: cart, error, isPending } = useCart();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();
  const hasItems = Boolean(cart && cart.items.length > 0);

  return (
    <div className='mx-auto flex max-w-[560px] flex-col px-4 py-6'>
      <PageHeader
        title='장바구니'
        actions={
          hasItems ? (
            <Button
              variant='secondary'
              size='sm'
              disabled={isClearing}
              onClick={() => clearCart()}
            >
              비우기
            </Button>
          ) : null
        }
      />

      {isPending ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='장바구니 불러오는 중' />
          장바구니를 불러오고 있어요.
        </div>
      ) : null}

      {error ? <EmptyState message={getErrorMessage(error)} /> : null}

      {cart && hasItems ? <CartSummaryCard cart={cart} /> : null}

      {cart && !hasItems ? (
        <EmptyState
          message='장바구니가 비어 있어요.'
          action={
            <Link
              to='/'
              className={STORE_LIST_LINK_CLASS}
            >
              가게 둘러보기
            </Link>
          }
        />
      ) : null}
    </div>
  );
}
