import type { Menu, SaleStatus } from '@/entities/menu';
import { apiClient } from '@/shared/api';

/** 메뉴 등록·수정 요청 본문 */
export interface MenuUpsertRequest {
  name: string;
  description: string | null;
  price: number;
}

/**
 * 메뉴를 등록한다.
 * @param storeId - 가게 ID
 * @param request - 메뉴 정보
 * @returns 등록한 메뉴
 */
export const createMenu = async (storeId: number, request: MenuUpsertRequest): Promise<Menu> => {
  const { data } = await apiClient.post<Menu>(`/stores/${storeId}/menus`, request);
  return data;
};

/**
 * 메뉴를 수정한다.
 * @param storeId - 가게 ID
 * @param menuId - 메뉴 ID
 * @param request - 메뉴 정보
 * @returns 수정한 메뉴
 */
export const updateMenu = async (storeId: number, menuId: number, request: MenuUpsertRequest): Promise<Menu> => {
  const { data } = await apiClient.put<Menu>(`/stores/${storeId}/menus/${menuId}`, request);
  return data;
};

/**
 * 메뉴를 삭제한다. (204, 지난 주문 내역에는 남음)
 * @param storeId - 가게 ID
 * @param menuId - 메뉴 ID
 */
export const removeMenu = async (storeId: number, menuId: number): Promise<void> => {
  await apiClient.delete(`/stores/${storeId}/menus/${menuId}`);
};

/**
 * 메뉴 판매 상태(판매 중·품절)를 바꾼다.
 * @param storeId - 가게 ID
 * @param menuId - 메뉴 ID
 * @param saleStatus - 바꿀 판매 상태
 * @returns 바뀐 메뉴
 */
export const updateMenuSaleStatus = async (storeId: number, menuId: number, saleStatus: SaleStatus): Promise<Menu> => {
  const { data } = await apiClient.patch<Menu>(`/stores/${storeId}/menus/${menuId}/status`, { saleStatus });
  return data;
};
