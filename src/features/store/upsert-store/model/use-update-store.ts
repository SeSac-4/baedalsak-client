import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { storeKeys, type StoreDetail } from '@/entities/store';

import { updateStore, type StoreUpsertRequest } from '../api/upsert-store-api';

/**
 * 가게 정보 수정. 성공하면 내 가게(stores/me)를 포함한 가게 쿼리를 invalidate한다.
 * @param storeId - 가게 ID
 * @returns 가게 수정 mutation
 */
export const useUpdateStore = (storeId: number): UseMutationResult<StoreDetail, unknown, StoreUpsertRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: StoreUpsertRequest) => updateStore(storeId, request),
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: storeKeys.all });
    },
  });
};
