import { apiClient } from '@/shared/api';

import type { Delivery, RiderDelivery, WaitingDelivery } from '../model/delivery-types';

/**
 * 배차 대기 목록을 오래된 순으로 조회한다. (라이더)
 * @returns 배차 대기 배달 목록
 */
export const getWaitingDeliveryList = async (): Promise<WaitingDelivery[]> => {
  const { data } = await apiClient.get<WaitingDelivery[]>('/deliveries/waiting');
  return data;
};

/**
 * 내가 진행 중인 배달(배차 완료·픽업 완료)을 조회한다. (라이더) 없으면 404 DELIVERY_NOT_FOUND.
 * @returns 진행 중 배달
 */
export const getActiveDelivery = async (): Promise<RiderDelivery> => {
  const { data } = await apiClient.get<RiderDelivery>('/deliveries/me/active');
  return data;
};

/**
 * 주문의 배달 상태를 조회한다. (고객·사장님) 주문 수락 직후 아직 만들어지기 전이면 404 DELIVERY_NOT_FOUND.
 * @param orderId - 주문 ID
 * @returns 배달 상태
 */
export const getDeliveryByOrder = async (orderId: number): Promise<Delivery> => {
  const { data } = await apiClient.get<Delivery>(`/deliveries/by-order/${orderId}`);
  return data;
};
