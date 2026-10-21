import type { Menu } from './menu-types';

/** 화면 확인용 메뉴 목록 — 판매 중 4 · 품절 1 (API 연동 전 임시) */
export const MENU_LIST_MOCK: Menu[] = [
  { id: 1, storeId: 1, name: '참치김밥', description: '고소한 참치마요 듬뿍', price: 4500, saleStatus: 'ON_SALE' },
  { id: 2, storeId: 1, name: '라볶이', description: '라면사리 넣은 매콤 떡볶이', price: 6000, saleStatus: 'ON_SALE' },
  { id: 3, storeId: 1, name: '치즈김밥', description: null, price: 5000, saleStatus: 'ON_SALE' },
  { id: 4, storeId: 1, name: '떡볶이', description: '쌀떡 기본 떡볶이', price: 5500, saleStatus: 'ON_SALE' },
  { id: 5, storeId: 1, name: '모둠튀김', description: '김말이·만두·고추튀김', price: 4000, saleStatus: 'SOLD_OUT' },
];
