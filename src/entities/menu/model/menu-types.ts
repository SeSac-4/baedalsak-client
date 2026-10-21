/** 판매 상태: 판매 중 / 품절 */
export type SaleStatus = 'ON_SALE' | 'SOLD_OUT';

/** GET /stores/{storeId}/menus 응답 항목 */
export interface Menu {
  id: number;
  storeId: number;
  name: string;
  description: string | null;
  price: number;
  saleStatus: SaleStatus;
}
