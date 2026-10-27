import type { CategoryCode } from '@/entities/category/@x/store';
import { apiClient } from '@/shared/api';

import type { StoreDetail, StoreSummary } from '../model/store-types';

/**
 * 가게 목록을 조회한다. 카테고리를 생략하면 전체.
 * @param category - 카테고리 코드
 * @returns 가게 요약 목록
 */
export const getStoreList = async (category?: CategoryCode): Promise<StoreSummary[]> => {
  const { data } = await apiClient.get<StoreSummary[]>('/stores', { params: { category } });
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
