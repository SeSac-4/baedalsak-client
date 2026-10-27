import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getCategoryList } from '../api/category-api';
import { categoryKeys } from '../api/category-query';
import type { Category } from './category-types';

/** 카테고리는 고정 6개라 거의 바뀌지 않는다 */
const CATEGORY_STALE_TIME_MS = 60 * 60 * 1000;

/**
 * 카테고리 목록을 조회한다.
 * @returns 카테고리 목록 쿼리 결과
 */
export const useCategoryList = (): UseQueryResult<Category[]> =>
  useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategoryList,
    staleTime: CATEGORY_STALE_TIME_MS,
  });
