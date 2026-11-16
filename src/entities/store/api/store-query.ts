import type { LatLngLiteral } from '@/shared/lib/kakao-map';

import type { StoreListFilter } from '../model/store-types';

/**
 * 위치를 쿼리 키 조각으로 바꾼다.
 * @param position - 내 위치 (없으면 undefined)
 * @returns 'lat,lng' 또는 'ALL'
 */
const getPositionKey = (position?: LatLngLiteral): string => (position ? `${position.lat},${position.lng}` : 'ALL');

/** 가게 쿼리 키 팩토리 */
export const storeKeys = {
  all: ['store'] as const,
  /**
   * 가게 목록 키를 만든다.
   * @param filter - 카테고리·검색어·내 위치
   * @returns 쿼리 키
   */
  list: ({ category, q, position }: StoreListFilter) =>
    [...storeKeys.all, 'list', category ?? 'ALL', q ?? '', getPositionKey(position)] as const,
  /**
   * 가게 목록 통계 키를 만든다. storeKeys.all 아래라 가게 등록·수정 때 함께 갱신된다.
   * @param position - 내 위치 (없으면 전체 기준)
   * @returns 쿼리 키
   */
  summary: (position?: LatLngLiteral) => [...storeKeys.all, 'summary', getPositionKey(position)] as const,
  /**
   * 가게 상세 키를 만든다.
   * @param storeId - 가게 ID
   * @returns 쿼리 키
   */
  detail: (storeId: number) => [...storeKeys.all, 'detail', storeId] as const,
  /**
   * 내 가게(사장님) 키를 만든다.
   * @returns 쿼리 키
   */
  me: () => [...storeKeys.all, 'me'] as const,
};
