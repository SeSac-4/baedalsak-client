import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { storeKeys } from '@/entities/store';

import { removeStore } from '../api/remove-store-api';

/**
 * 가게 폐업. 성공하면 가게 쿼리를 오래된 것으로 표시하고 내 가게를 다시 받는다.
 * 내 가게가 404가 되면 사장님 가드·레이아웃이 가게 등록 전 상태로 바뀐다.
 * @param storeId - 가게 ID
 * @returns 가게 폐업 mutation
 */
export const useRemoveStore = (storeId: number): UseMutationResult<void, unknown, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeStore(storeId),
    onSuccess: async (): Promise<void> => {
      queryClient.removeQueries({ queryKey: storeKeys.detail(storeId) });
      await queryClient.invalidateQueries({ queryKey: storeKeys.all, refetchType: 'none' });
      await queryClient.resetQueries({ queryKey: storeKeys.me() });
    },
  });
};
