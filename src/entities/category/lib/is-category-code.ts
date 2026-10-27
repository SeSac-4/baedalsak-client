import { CATEGORY_CODES, type CategoryCode } from '../model/category-types';

const CATEGORY_CODE_LIST: readonly string[] = CATEGORY_CODES;

/**
 * 문자열이 카테고리 코드인지 확인한다. (URL 쿼리 값 검증용)
 * @param value - 확인할 값
 * @returns 카테고리 코드 여부
 */
export const isCategoryCode = (value: string | null): value is CategoryCode =>
  value !== null && CATEGORY_CODE_LIST.includes(value);
