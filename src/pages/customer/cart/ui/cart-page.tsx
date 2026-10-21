import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { CART_MOCK } from '@/entities/cart';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { CartSummaryCard } from '@/widgets/cart-summary';

/**
 * U-03 장바구니 화면. 항목 수량·삭제, 합계, 주문 불가 안내, 비우기를 보여 준다. (목 데이터)
 * @returns 장바구니 페이지
 */
export function CartPage(): ReactNode {
  const cart = CART_MOCK;
  const isEmpty = cart.items.length === 0;

  return (
    <div className='mx-auto flex max-w-[560px] flex-col px-4 py-6'>
      <PageHeader
        title='장바구니'
        actions={
          isEmpty ? null : (
            <Button
              variant='secondary'
              size='sm'
            >
              비우기
            </Button>
          )
        }
      />
      {isEmpty ? (
        <EmptyState
          message='장바구니가 비어 있어요.'
          action={
            <Link
              to='/'
              className='text-note font-medium text-role hover:underline'
            >
              가게 둘러보기
            </Link>
          }
        />
      ) : (
        <CartSummaryCard cart={cart} />
      )}
    </div>
  );
}
