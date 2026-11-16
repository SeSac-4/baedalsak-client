import {
  keepPreviousData,
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';

import { getStoreList } from '../api/store-api';
import { storeKeys } from '../api/store-query';
import type { StoreListFilter, StorePage } from './store-types';

/**
 * 다음에 받을 커서를 고른다. 커서는 해석하지 않고 서버가 준 값을 그대로 넘긴다.
 * @param lastPage - 마지막으로 받은 페이지
 * @returns 다음 커서 (더 없으면 undefined)
 */
const getNextPageParam = (lastPage: StorePage): string | undefined =>
  lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined;

/**
 * 가게 목록을 등록순으로 조회한다. 목록 끝에 닿으면 다음 페이지를 이어 받는다.
 * 카테고리·검색어·위치가 바뀌는 동안 이전 결과를 보여 줘 목록이 비었다가 깜빡이지 않게 한다.
 * @param filter - 카테고리·검색어·내 위치 (위치가 있으면 반경 안의 가게만)
 * @returns 가게 목록 무한 쿼리 결과
 */
export const useStoreList = (
  filter: StoreListFilter,
): UseInfiniteQueryResult<InfiniteData<StorePage, string | undefined>> =>
  useInfiniteQuery({
    queryKey: storeKeys.list(filter),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => getStoreList(filter, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam,
    placeholderData: keepPreviousData,
  });
