import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { menuKeys, type Menu } from '@/entities/menu';

import { createMenu, updateMenu, type MenuUpsertRequest } from '../api/menu-manage-api';

/** 메뉴 등록·수정 인자. menuId가 있으면 수정 */
export interface UpsertMenuVariables {
  menuId: number | null;
  request: MenuUpsertRequest;
}

/**
 * 메뉴 등록·수정. 성공하면 가게 메뉴 목록을 invalidate한다.
 * @param storeId - 가게 ID
 * @returns 메뉴 등록·수정 mutation
 */
export const useUpsertMenu = (storeId: number): UseMutationResult<Menu, unknown, UpsertMenuVariables> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ menuId, request }: UpsertMenuVariables) =>
      menuId === null ? createMenu(storeId, request) : updateMenu(storeId, menuId, request),
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: menuKeys.list(storeId) });
    },
  });
};
