import type { CategoryCode } from '@/entities/category/@x/store';
import { apiClient } from '@/shared/api';

import type { StoreDetail, StoreListSummary, StorePage } from '../model/store-types';

/**
 * 가게 목록 한 페이지를 등록순으로 조회한다. 카테고리·검색어를 생략하면 전체, 커서를 생략하면 첫 페이지.
 * 검색어가 비어 있으면 파라미터에서 뺀다.
 * @param category - 카테고리 코드
 * @param q - 가게 이름 검색어 (부분 일치, 최대 50자)
 * @param cursor - 이전 응답의 nextCursor
 * @returns 가게 목록 페이지
 */
export const getStoreList = async (category?: CategoryCode, q?: string, cursor?: string): Promise<StorePage> => {
  const { data } = await apiClient.get<StorePage>('/stores', { params: { category, q: q || undefined, cursor } });
  return data;
};

/**
 * 가게 목록 통계(전체·영업 중·카테고리별 가게 수, 최저 배달비)를 조회한다.
 * @returns 가게 목록 통계
 */
export const getStoreListSummary = async (): Promise<StoreListSummary> => {
  const { data } = await apiClient.get<StoreListSummary>('/stores/summary');
  return data;
};

/**
 * 가게 상세를 조회한다. 없으면 404 STORE_NOT_FOUND.
 * @param storeId - 가게 ID
 * @returns 가게 상세
 */
export const getStore = async (storeId: number): Promise<StoreDetail> => {
  const { data } = await apiClient.get<StoreDetail>(`/stores/${storeId}`);
  return data;
};

/**
 * 내 가게(사장님)를 조회한다. 아직 등록하지 않았으면 404 STORE_NOT_FOUND.
 * @returns 내 가게 상세
 */
export const getMyStore = async (): Promise<StoreDetail> => {
  const { data } = await apiClient.get<StoreDetail>('/stores/me');
  return data;
};
