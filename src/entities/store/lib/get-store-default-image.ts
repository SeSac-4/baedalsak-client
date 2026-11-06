import type { CategoryCode } from '@/entities/category/@x/store';

/** 카테고리별 기본 그림 (public/store-defaults) */
const STORE_DEFAULT_IMAGE: Record<CategoryCode, string> = {
  KOREAN: '/store-defaults/korean.svg',
  SNACK: '/store-defaults/snack.svg',
  CHICKEN: '/store-defaults/chicken.svg',
  CHINESE: '/store-defaults/chinese.svg',
  PIZZA: '/store-defaults/pizza.svg',
  CAFE_DESSERT: '/store-defaults/cafe-dessert.svg',
};

/**
 * 가게 사진이 없을 때 보여 줄 카테고리 기본 그림을 구한다.
 * @param category - 카테고리 코드
 * @returns 기본 그림 주소
 */
export const getStoreDefaultImage = (category: CategoryCode): string => STORE_DEFAULT_IMAGE[category];
