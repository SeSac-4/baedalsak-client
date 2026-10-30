import type { ReactNode } from 'react';
import { Link, Navigate } from 'react-router';

import { useCart } from '@/entities/cart';
import { useMe } from '@/entities/session';
import { getErrorMessage } from '@/shared/api';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

import { CheckoutForm } from './checkout-form';

const CART_PATH = '/cart';

/**
 * U-04 주문서 화면. 내 장바구니(GET /cart)로 주문 요약을 보여 준다.
 * 장바구니가 비었거나 주문할 수 없으면(canOrder=false) 장바구니로 돌려보낸다. 연락처는 내 정보(GET /members/me)의 휴대폰 번호.
 * @returns 주문서 페이지
 */
export function CheckoutPage(): ReactNode {
  const { data: cart, error, isPending } = useCart();
  const { data: me } = useMe();

  if (isPending) {
    return (
      <div className='flex items-center justify-center gap-2 py-16 text-note text-fg-muted'>
        <Spinner label='주문 정보 불러오는 중' />
        주문 정보를 불러오고 있어요.
      </div>
    );
  }

  if (!cart) {
    return (
      <div className='mx-auto max-w-[1100px] px-4 py-6'>
        <EmptyState message={getErrorMessage(error)} />
      </div>
    );
  }

  if (!cart.canOrder) {
    return (
      <Navigate
        to={CART_PATH}
        replace
      />
    );
  }

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col gap-2 px-4 py-6'>
      <Link
        to={CART_PATH}
        className='self-start text-note text-fg-muted hover:text-fg'
      >
        ‹ 장바구니
      </Link>
      <PageHeader title='주문하기' />
      <CheckoutForm
        cart={cart}
        phone={me?.phone ?? ''}
      />
    </div>
  );
}
