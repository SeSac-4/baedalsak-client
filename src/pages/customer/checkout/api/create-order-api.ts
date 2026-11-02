import { apiClient } from '@/shared/api';

/** 주문 생성 요청 본문. 주문 항목은 서버가 장바구니에서 가져온다 */
export interface CreateOrderRequest {
  deliveryAddress: string;
  deliveryDong: string;
  storeRequest: string | null;
  riderRequest: string | null;
}

/** 주문 생성 응답 중 이 화면이 쓰는 값 (전체는 OrderDetail, 타입 정리는 주문 상세 연동 때) */
export interface CreatedOrder {
  id: number;
}

/**
 * 장바구니로 주문을 만든다. 주문은 결제대기 상태로 생성되고 서버가 장바구니를 비운다.
 * @param request - 배달 주소·동·요청사항
 * @returns 만든 주문 (id)
 */
export const createOrder = async (request: CreateOrderRequest): Promise<CreatedOrder> => {
  const { data } = await apiClient.post<CreatedOrder>('/orders', request);
  return data;
};
