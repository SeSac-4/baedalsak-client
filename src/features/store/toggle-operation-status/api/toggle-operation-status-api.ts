import type { OperationStatus, StoreDetail } from '@/entities/store';
import { apiClient } from '@/shared/api';

/**
 * 가게 운영 상태(정상 운영·임시 중지)를 바꾼다.
 * @param storeId - 가게 ID
 * @param operationStatus - 바꿀 운영 상태
 * @returns 바뀐 가게 상세
 */
export const updateOperationStatus = async (
  storeId: number,
  operationStatus: OperationStatus,
): Promise<StoreDetail> => {
  const { data } = await apiClient.patch<StoreDetail>(`/stores/${storeId}/status`, { operationStatus });
  return data;
};
