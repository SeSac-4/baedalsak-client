import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { storeKeys, type StoreDetail } from '@/entities/store';

import { createStore, type StoreUpsertRequest } from '../api/upsert-store-api';

/**
 * 가게 등록. 성공하면 내 가게 캐시를 새 값으로 채우고 가게 쿼리를 다시 받는다.
 * @returns 가게 등록 mutation
 */
export const useCreateStore = (): UseMutationResult<StoreDetail, unknown, StoreUpsertRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStore,
    onSuccess: async (store: StoreDetail): Promise<void> => {
      queryClient.setQueryData(storeKeys.me(), store);
      await queryClient.invalidateQueries({ queryKey: storeKeys.all });
    },
  });
};
