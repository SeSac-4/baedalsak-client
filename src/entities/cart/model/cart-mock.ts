import type { Cart } from './cart-types';

/** 화면 확인용 장바구니 — 주문 가능 (API 연동 전 임시) */
export const CART_MOCK: Cart = {
  storeId: 1,
  storeName: '싹싹김밥 성수점',
  items: [
    { menuId: 1, menuName: '참치김밥', price: 4500, quantity: 2 },
    { menuId: 2, menuName: '라볶이', price: 6000, quantity: 1 },
  ],
  itemsAmount: 15000,
  deliveryFee: 3000,
  totalAmount: 18000,
  minOrderAmount: 12000,
  canOrder: true,
  cannotOrderReason: null,
};

/** 화면 확인용 장바구니 — 최소주문금액 미달 */
export const CART_MIN_NOT_MET_MOCK: Cart = {
  storeId: 1,
  storeName: '싹싹김밥 성수점',
  items: [{ menuId: 1, menuName: '참치김밥', price: 4500, quantity: 1 }],
  itemsAmount: 4500,
  deliveryFee: 3000,
  totalAmount: 7500,
  minOrderAmount: 12000,
  canOrder: false,
  cannotOrderReason: 'MIN_ORDER_AMOUNT_NOT_MET',
};

/** 화면 확인용 장바구니 — 비어 있음 */
export const CART_EMPTY_MOCK: Cart = {
  storeId: null,
  storeName: null,
  items: [],
  itemsAmount: 0,
  deliveryFee: 0,
  totalAmount: 0,
  minOrderAmount: 0,
  canOrder: false,
  cannotOrderReason: 'CART_EMPTY',
};
