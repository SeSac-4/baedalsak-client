import type { Delivery, RiderDelivery } from '@/entities/delivery';
import { apiClient } from '@/shared/api';

/**
 * 가게에서 음식을 받아 픽업 완료로 바꾼다. (배정된 라이더) 배차 완료가 아니면 409 DELIVERY_INVALID_STATUS.
 * @param deliveryId - 배달 ID
 * @returns 픽업 완료된 배달 (고객 연락처 없음)
 */
export const pickupDelivery = async (deliveryId: number): Promise<RiderDelivery> => {
  const { data } = await apiClient.post<RiderDelivery>(`/deliveries/${deliveryId}/pickup`);
  return data;
};

/**
 * 고객에게 전달하고 배달 완료로 바꾼다. (배정된 라이더) 픽업 완료가 아니면 409 DELIVERY_INVALID_STATUS.
 * @param deliveryId - 배달 ID
 * @returns 배달 상태 (고객 연락처 없음)
 */
export const completeDelivery = async (deliveryId: number): Promise<Delivery> => {
  const { data } = await apiClient.post<Delivery>(`/deliveries/${deliveryId}/complete`);
  return data;
};
