import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { menuKeys, type Menu } from '@/entities/menu';
import { getErrorMessage } from '@/shared/api';
import { useToast } from '@/shared/ui/toast';

import { updateMenuSaleStatus } from '../api/menu-manage-api';

/**
 * 판매 중 ↔ 품절 전환. 성공하면 메뉴 목록을 invalidate하고, 실패하면 서버 메시지를 토스트로 보여 준다.
 * @param storeId - 가게 ID
 * @returns 판매 상태 전환 mutation (인자: 바꿀 메뉴)
 */
export const useToggleSaleStatus = (storeId: number): UseMutationResult<Menu, unknown, Menu> => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (menu: Menu) =>
      updateMenuSaleStatus(storeId, menu.id, menu.saleStatus === 'ON_SALE' ? 'SOLD_OUT' : 'ON_SALE'),
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: menuKeys.list(storeId) });
    },
    onError: (error: unknown): void => {
      toast(getErrorMessage(error));
    },
  });
};
