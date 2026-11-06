import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import { useCart } from '@/entities/cart';
import { useMe } from '@/entities/session';
import { getErrorMessage } from '@/shared/api';
import { EmptyState } from '@/shared/ui/empty-state';
import { Spinner } from '@/shared/ui/spinner';

import { CheckoutForm } from './checkout-form';

const CART_PATH = '/cart';

/**
 * U-04 주문서·결제 화면. 내 장바구니(GET /cart)로 주문 요약을 보여 주고, 같은 화면에서 결제 방법을 고른다.
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
      <div className='mx-auto w-full px-4 py-6 tablet:max-w-[760px] tablet:px-6 desktop:max-w-[1180px] desktop:px-10'>
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
    <CheckoutForm
      cart={cart}
      phone={me?.phone ?? ''}
    />
  );
}
