import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getCart } from '../api/cart-api';
import { cartKeys } from '../api/cart-query';
import type { Cart } from './cart-types';

/**
 * 내 장바구니를 조회한다.
 * @returns 장바구니 쿼리 결과
 */
export const useCart = (): UseQueryResult<Cart> =>
  useQuery({
    queryKey: cartKeys.detail(),
    queryFn: getCart,
  });
