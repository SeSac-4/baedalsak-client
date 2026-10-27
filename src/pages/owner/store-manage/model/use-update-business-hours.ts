import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { storeKeys, type BusinessHour, type StoreDetail } from '@/entities/store';

import { updateBusinessHours } from '../api/business-hours-api';

/**
 * 영업시간 저장. 성공하면 내 가게(stores/me)를 포함한 가게 쿼리를 invalidate한다.
 * @param storeId - 가게 ID
 * @returns 영업시간 저장 mutation
 */
export const useUpdateBusinessHours = (storeId: number): UseMutationResult<StoreDetail, unknown, BusinessHour[]> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (businessHours: BusinessHour[]) => updateBusinessHours(storeId, businessHours),
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: storeKeys.all });
    },
  });
};
