/** 고정 카테고리 코드 (store.category CHECK 제약과 동일) */
export type CategoryCode = 'KOREAN' | 'SNACK' | 'CHICKEN' | 'CHINESE' | 'PIZZA' | 'CAFE_DESSERT';

/** GET /categories 응답 항목 */
export interface Category {
  code: CategoryCode;
  name: string;
}
