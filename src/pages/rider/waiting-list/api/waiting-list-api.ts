import type { RiderDelivery } from '@/entities/delivery';
import { apiClient } from '@/shared/api';

/**
 * 배차 대기 중인 배달을 수락해 나에게 배정한다. (라이더)
 * 다른 라이더가 먼저 수락했으면 409 DELIVERY_ALREADY_ASSIGNED, 내가 이미 진행 중인 배달이 있으면 409 DELIVERY_INVALID_STATUS.
 * @param deliveryId - 배달 ID
 * @returns 배정된 배달 (고객 연락처 없음 — 진행 중 배달 조회로 받는다)
 */
export const acceptDelivery = async (deliveryId: number): Promise<RiderDelivery> => {
  const { data } = await apiClient.post<RiderDelivery>(`/deliveries/${deliveryId}/accept`);
  return data;
};
