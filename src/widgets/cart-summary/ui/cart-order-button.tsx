import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import type { Cart } from '@/entities/cart';
import { Button } from '@/shared/ui/button';

const CHECKOUT_PATH = '/checkout';

export interface CartOrderButtonProps {
  cart: Cart;
  /** 가게가 지금 영업 중인지 */
  isStoreOpen: boolean;
  className?: string;
}

/**
 * 주문 버튼 문구를 고른다.
 * @param cart - 장바구니
 * @param isStoreOpen - 가게 영업 여부
 * @returns 버튼 문구
 */
const getOrderLabel = (cart: Cart, isStoreOpen: boolean): string => {
  if (!isStoreOpen) return '영업시간이 아니에요';
  return cart.canOrder ? '주문하기' : '최소주문금액을 채워 주세요';
};

/**
 * 주문하기 버튼. 주문할 수 없으면 이유를 문구로 보여 주고 막는다.
 * @param props cart(장바구니), isStoreOpen(가게 영업 여부), className
 * @returns 주문 버튼 요소
 */
export function CartOrderButton({ cart, isStoreOpen, className }: CartOrderButtonProps): ReactNode {
  const navigate = useNavigate();

  return (
    <Button
      block
      size='lg'
      disabled={!cart.canOrder || !isStoreOpen}
      className={className}
      onClick={() => navigate(CHECKOUT_PATH)}
    >
      {getOrderLabel(cart, isStoreOpen)}
    </Button>
  );
}
