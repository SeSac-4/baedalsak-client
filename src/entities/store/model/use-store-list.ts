import {
  keepPreviousData,
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';

import type { CategoryCode } from '@/entities/category/@x/store';

import { getStoreList } from '../api/store-api';
import { storeKeys } from '../api/store-query';
import type { StorePage } from './store-types';

/**
 * 다음에 받을 커서를 고른다. 커서는 해석하지 않고 서버가 준 값을 그대로 넘긴다.
 * @param lastPage - 마지막으로 받은 페이지
 * @returns 다음 커서 (더 없으면 undefined)
 */
const getNextPageParam = (lastPage: StorePage): string | undefined =>
  lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined;

/**
 * 가게 목록을 등록순으로 조회한다. 목록 끝에 닿으면 다음 페이지를 이어 받는다.
 * 카테고리·검색어가 바뀌는 동안 이전 결과를 보여 줘 목록이 비었다가 깜빡이지 않게 한다.
 * @param category - 카테고리 코드 (전체면 undefined)
 * @param q - 가게 이름 검색어 (없으면 undefined)
 * @returns 가게 목록 무한 쿼리 결과
 */
export const useStoreList = (
  category?: CategoryCode,
  q?: string,
): UseInfiniteQueryResult<InfiniteData<StorePage, string | undefined>> =>
  useInfiniteQuery({
    queryKey: storeKeys.list(category, q),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => getStoreList(category, q, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam,
    placeholderData: keepPreviousData,
  });
