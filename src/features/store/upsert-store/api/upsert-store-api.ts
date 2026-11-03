import type { StoreDetail } from '@/entities/store';
import { apiClient } from '@/shared/api';

import type { StoreFormValues } from '../model/store-schema';

/** 가게 등록·수정 요청 본문. 수정은 전체 교체라 사진 키도 함께 보낸다 (사진 없음·등록 시 null) */
export interface StoreUpsertRequest extends StoreFormValues {
  imageKey: string | null;
}

/**
 * 가게를 등록한다. 등록 직후 운영 상태는 임시 중지, 영업시간은 09:00~22:00. 이미 있으면 409 STORE_ALREADY_EXISTS.
 * @param request - 가게 정보
 * @returns 등록한 가게 상세
 */
export const createStore = async (request: StoreUpsertRequest): Promise<StoreDetail> => {
  const { data } = await apiClient.post<StoreDetail>('/stores', request);
  return data;
};

/**
 * 가게 정보를 수정한다.
 * @param storeId - 가게 ID
 * @param request - 가게 정보
 * @returns 수정한 가게 상세
 */
export const updateStore = async (storeId: number, request: StoreUpsertRequest): Promise<StoreDetail> => {
  const { data } = await apiClient.put<StoreDetail>(`/stores/${storeId}`, request);
  return data;
};
