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
  /** 메뉴 사진 주소 (CloudFront, 사진 없으면 null) */
  imageUrl: string | null;
  /** 메뉴 사진 S3 키 (수정 요청에 그대로 다시 보낸다, 사진 없으면 null) */
  imageKey: string | null;
}
