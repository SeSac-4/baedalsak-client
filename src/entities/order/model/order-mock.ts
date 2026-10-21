import type { OrderDetail, OrderItem } from './order-types';

const ITEMS_MOCK: OrderItem[] = [
  { menuId: 1, menuName: '참치김밥', price: 4500, quantity: 2 },
  { menuId: 2, menuName: '라볶이', price: 6000, quantity: 1 },
];

/** 상태별 공통 필드 (싹싹김밥 성수점, 18,000원) */
const BASE_ORDER_MOCK: Omit<
  OrderDetail,
  'id' | 'status' | 'createdAt' | 'paymentId' | 'estimatedReadyAt' | 'statusHistory'
> = {
  storeId: 1,
  storeName: '싹싹김밥 성수점',
  items: ITEMS_MOCK,
  itemsAmount: 15000,
  deliveryFee: 3000,
  totalAmount: 18000,
  deliveryAddress: '서울 성동구 성수이로 113, 302호',
  storeRequest: '김밥 썰어 주세요',
  riderRequest: '문 앞에 두고 벨 눌러 주세요',
};

/** 화면 확인용 내 주문 목록 — 상태 5종, 최신순 (API 연동 전 임시) */
export const ORDER_LIST_MOCK: OrderDetail[] = [
  {
    ...BASE_ORDER_MOCK,
    id: 1005,
    status: 'PENDING_PAYMENT',
    createdAt: '2026-10-13T12:50:00+09:00',
    paymentId: null,
    estimatedReadyAt: null,
    statusHistory: [{ status: 'PENDING_PAYMENT', at: '2026-10-13T12:50:00+09:00' }],
  },
  {
    ...BASE_ORDER_MOCK,
    id: 1004,
    status: 'PAID',
    createdAt: '2026-10-13T12:40:00+09:00',
    paymentId: 504,
    estimatedReadyAt: null,
    statusHistory: [
      { status: 'PENDING_PAYMENT', at: '2026-10-13T12:40:00+09:00' },
      { status: 'PAID', at: '2026-10-13T12:41:00+09:00' },
    ],
  },
  {
    ...BASE_ORDER_MOCK,
    id: 1003,
    status: 'COOKING',
    createdAt: '2026-10-13T12:30:00+09:00',
    paymentId: 503,
    estimatedReadyAt: '2026-10-13T12:53:00+09:00',
    statusHistory: [
      { status: 'PENDING_PAYMENT', at: '2026-10-13T12:30:00+09:00' },
      { status: 'PAID', at: '2026-10-13T12:31:00+09:00' },
      { status: 'COOKING', at: '2026-10-13T12:33:00+09:00' },
    ],
  },
  {
    ...BASE_ORDER_MOCK,
    id: 1002,
    status: 'DELIVERING',
    createdAt: '2026-10-13T11:50:00+09:00',
    paymentId: 502,
    estimatedReadyAt: '2026-10-13T12:10:00+09:00',
    statusHistory: [
      { status: 'PENDING_PAYMENT', at: '2026-10-13T11:50:00+09:00' },
      { status: 'PAID', at: '2026-10-13T11:51:00+09:00' },
      { status: 'COOKING', at: '2026-10-13T11:53:00+09:00' },
      { status: 'DELIVERING', at: '2026-10-13T12:12:00+09:00' },
    ],
  },
  {
    ...BASE_ORDER_MOCK,
    id: 1001,
    status: 'DELIVERED',
    createdAt: '2026-10-12T18:20:00+09:00',
    paymentId: 501,
    estimatedReadyAt: '2026-10-12T18:40:00+09:00',
    statusHistory: [
      { status: 'PENDING_PAYMENT', at: '2026-10-12T18:20:00+09:00' },
      { status: 'PAID', at: '2026-10-12T18:21:00+09:00' },
      { status: 'COOKING', at: '2026-10-12T18:22:00+09:00' },
      { status: 'DELIVERING', at: '2026-10-12T18:42:00+09:00' },
      { status: 'DELIVERED', at: '2026-10-12T18:58:00+09:00' },
    ],
  },
];

/**
 * 주문 ID로 목 주문 상세를 찾는다.
 * @param orderId 주문 ID
 * @returns 주문 상세 (없으면 undefined)
 */
export const getOrderMock = (orderId: number): OrderDetail | undefined =>
  ORDER_LIST_MOCK.find((order) => order.id === orderId);
