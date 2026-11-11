import { apiClient } from '@/shared/api';

/**
 * 가게를 폐업한다 (soft delete). 진행 중 주문이 있으면 409 STORE_HAS_ACTIVE_ORDERS.
 * @param storeId - 가게 ID
 */
export const removeStore = async (storeId: number): Promise<void> => {
  await apiClient.delete(`/stores/${storeId}`);
};
