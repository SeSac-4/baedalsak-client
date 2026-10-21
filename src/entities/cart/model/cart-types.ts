/** 주문 불가 사유 (GET /cart cannotOrderReason) */
export type CannotOrderReason = 'CART_EMPTY' | 'MIN_ORDER_AMOUNT_NOT_MET' | 'STORE_CLOSED';

/** 장바구니 항목. 메뉴명·가격은 담을 때 스냅샷 */
export interface CartItem {
  menuId: number;
  menuName: string;
  price: number;
  quantity: number;
}

/** GET /cart 응답 */
export interface Cart {
  /** 비어 있으면 null */
  storeId: number | null;
  /** 비어 있으면 null */
  storeName: string | null;
  items: CartItem[];
  itemsAmount: number;
  deliveryFee: number;
  totalAmount: number;
  minOrderAmount: number;
  canOrder: boolean;
  cannotOrderReason: CannotOrderReason | null;
}
