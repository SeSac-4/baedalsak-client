import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { menuKeys } from '@/entities/menu';
import { getErrorMessage } from '@/shared/api';
import { useToast } from '@/shared/ui/toast';

import { removeMenu } from '../api/menu-manage-api';

const REMOVED_MESSAGE = '메뉴를 삭제했어요.';

/**
 * 메뉴 삭제. 성공하면 메뉴 목록을 invalidate하고, 실패하면 서버 메시지를 토스트로 보여 준다.
 * @param storeId - 가게 ID
 * @returns 메뉴 삭제 mutation (인자: 메뉴 ID)
 */
export const useRemoveMenu = (storeId: number): UseMutationResult<void, unknown, number> => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (menuId: number) => removeMenu(storeId, menuId),
    onSuccess: async (): Promise<void> => {
      toast(REMOVED_MESSAGE);
      await queryClient.invalidateQueries({ queryKey: menuKeys.list(storeId) });
    },
    onError: (error: unknown): void => {
      toast(getErrorMessage(error));
    },
  });
};
