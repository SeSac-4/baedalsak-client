import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { deliveryKeys, type RiderDelivery } from '@/entities/delivery';
import { getErrorCode, getErrorMessage } from '@/shared/api';
import { useToast } from '@/shared/ui/toast';

import { pickupDelivery } from '../api/active-delivery-api';

const DELIVERY_INVALID_STATUS = 'DELIVERY_INVALID_STATUS';

/**
 * 픽업 완료. 성공하면 응답으로 진행 중 배달 캐시를 갱신한다.
 * 응답에는 고객 연락처가 없으므로 기존 캐시 값에 덮어써서 연락처를 유지한다.
 * 실패하면 서버 메시지를 토스트로 보여 주고, 상태가 맞지 않으면(409) 진행 중 배달을 다시 조회한다.
 * @returns 픽업 완료 mutation (인자: 배달 ID)
 */
export const usePickupDelivery = (): UseMutationResult<RiderDelivery, unknown, number> => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: pickupDelivery,
    onSuccess: (delivery: RiderDelivery): void => {
      queryClient.setQueryData<RiderDelivery | null>(deliveryKeys.active(), (previous) =>
        previous ? { ...previous, ...delivery } : delivery,
      );
      toast('픽업을 완료했어요.');
    },
    onError: async (error: unknown): Promise<void> => {
      toast(getErrorMessage(error));
      if (getErrorCode(error) === DELIVERY_INVALID_STATUS) {
        await queryClient.invalidateQueries({ queryKey: deliveryKeys.active() });
      }
    },
  });
};
