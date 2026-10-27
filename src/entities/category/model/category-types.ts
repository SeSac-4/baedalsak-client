/** 고정 카테고리 코드 목록 (store.category CHECK 제약과 동일) */
export const CATEGORY_CODES = ['KOREAN', 'SNACK', 'CHICKEN', 'CHINESE', 'PIZZA', 'CAFE_DESSERT'] as const;

/** 고정 카테고리 코드 */
export type CategoryCode = (typeof CATEGORY_CODES)[number];

/** GET /categories 응답 항목 */
export interface Category {
  code: CategoryCode;
  name: string;
}
