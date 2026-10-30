import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { CART_MOCK } from '@/entities/cart';
import { PageHeader } from '@/shared/ui/page-header';

import { CheckoutForm } from './checkout-form';

/**
 * U-04 주문서 화면. 장바구니가 주문 가능할 때만 진입한다. (목 데이터)
 * @returns 주문서 페이지
 */
export function CheckoutPage(): ReactNode {
  return (
    <div className='mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-6'>
      <Link
        to='/cart'
        className='self-start text-note text-fg-muted hover:text-fg'
      >
        ‹ 장바구니
      </Link>
      <PageHeader title='주문하기' />
      <CheckoutForm
        cart={CART_MOCK}
        phone='010-1234-5678'
      />
    </div>
  );
}
