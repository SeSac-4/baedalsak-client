import type { BusinessHour, StoreDetail } from '@/entities/store';
import { apiClient } from '@/shared/api';

/**
 * 요일별 영업시간 7행을 한 번에 바꾼다.
 * @param storeId - 가게 ID
 * @param businessHours - 일~토 영업시간 (휴무면 시각 null)
 * @returns 바뀐 가게 상세
 */
export const updateBusinessHours = async (storeId: number, businessHours: BusinessHour[]): Promise<StoreDetail> => {
  const { data } = await apiClient.put<StoreDetail>(`/stores/${storeId}/business-hours`, { businessHours });
  return data;
};
