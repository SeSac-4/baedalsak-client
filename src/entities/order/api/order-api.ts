import { apiClient } from '@/shared/api';

import type { OrderDetail, OrderPage, OrderStatus, StoreOrderPage } from '../model/order-types';

/** 주문 목록 한 페이지 크기 (서버 기본 20, 최대 100) */
export const ORDER_PAGE_SIZE = 20;

/**
 * 내 주문 목록을 최신순으로 조회한다.
 * @param page - 페이지 번호 (0부터)
 * @returns 주문 목록 한 페이지
 */
export const getOrderList = async (page: number): Promise<OrderPage> => {
  const { data } = await apiClient.get<OrderPage>('/orders', { params: { page, size: ORDER_PAGE_SIZE } });
  return data;
};

/**
 * 주문 상세를 조회한다. 고객 본인·해당 가게 사장님만 볼 수 있고(그 외 403), 없으면 404 ORDER_NOT_FOUND.
 * @param orderId - 주문 ID
 * @returns 주문 상세
 */
export const getOrder = async (orderId: number): Promise<OrderDetail> => {
  const { data } = await apiClient.get<OrderDetail>(`/orders/${orderId}`);
  return data;
};

/**
 * 가게 주문 목록(사장님)을 조회한다. status는 같은 이름으로 반복해 보낸다 (?status=COOKING&status=DELIVERING).
 * @param storeId - 가게 ID
 * @param statuses - 조회할 주문 상태
 * @param page - 페이지 번호 (0부터)
 * @returns 가게 주문 목록 한 페이지
 */
export const getStoreOrderList = async (
  storeId: number,
  statuses: OrderStatus[],
  page: number,
): Promise<StoreOrderPage> => {
  const { data } = await apiClient.get<StoreOrderPage>(`/stores/${storeId}/orders`, {
    params: { status: statuses, page, size: ORDER_PAGE_SIZE },
    paramsSerializer: { indexes: null },
  });
  return data;
};
