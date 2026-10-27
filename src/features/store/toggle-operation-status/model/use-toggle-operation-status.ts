import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { storeKeys, type OperationStatus, type StoreDetail } from '@/entities/store';
import { getErrorMessage } from '@/shared/api';
import { useToast } from '@/shared/ui/toast';

import { updateOperationStatus } from '../api/toggle-operation-status-api';

const CHANGED_MESSAGE: Record<OperationStatus, string> = {
  OPEN: '정상 운영으로 바꿨어요.',
  PAUSED: '임시 중지로 바꿨어요.',
};

/**
 * 운영 상태 전환. 성공하면 내 가게 캐시를 갱신하고, 실패하면 서버 메시지를 토스트로 보여 준다.
 * @param storeId - 가게 ID
 * @returns 운영 상태 변경 mutation (인자: 바꿀 상태)
 */
export const useToggleOperationStatus = (storeId: number): UseMutationResult<StoreDetail, unknown, OperationStatus> => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (operationStatus: OperationStatus) => updateOperationStatus(storeId, operationStatus),
    onSuccess: async (store: StoreDetail): Promise<void> => {
      queryClient.setQueryData(storeKeys.me(), store);
      toast(CHANGED_MESSAGE[store.operationStatus]);
      await queryClient.invalidateQueries({ queryKey: storeKeys.all });
    },
    onError: (error: unknown): void => {
      toast(getErrorMessage(error));
    },
  });
};
