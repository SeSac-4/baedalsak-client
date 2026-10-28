import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { deliveryKeys, type Delivery, type RiderDelivery } from '@/entities/delivery';
import { getErrorCode, getErrorMessage } from '@/shared/api';
import { useToast } from '@/shared/ui/toast';

import { completeDelivery } from '../api/active-delivery-api';

const WAITING_LIST_PATH = '/rider';
const DELIVERY_INVALID_STATUS = 'DELIVERY_INVALID_STATUS';

/**
 * 배달 완료. 성공하면 진행 중 배달을 비우고 배차 대기 목록으로 이동한다.
 * 실패하면 서버 메시지를 토스트로 보여 주고, 상태가 맞지 않으면(409) 진행 중 배달을 다시 조회한다.
 * @returns 배달 완료 mutation (인자: 배달 ID)
 */
export const useCompleteDelivery = (): UseMutationResult<Delivery, unknown, number> => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: completeDelivery,
    onSuccess: async (): Promise<void> => {
      // 대기 목록 화면은 진행 중 배달이 있으면 이 화면으로 되돌려 보내므로, 이동 전에 먼저 비운다
      queryClient.setQueryData<RiderDelivery | null>(deliveryKeys.active(), null);
      toast('배달을 완료했어요.');
      navigate(WAITING_LIST_PATH);
      await queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
    },
    onError: async (error: unknown): Promise<void> => {
      toast(getErrorMessage(error));
      if (getErrorCode(error) === DELIVERY_INVALID_STATUS) {
        await queryClient.invalidateQueries({ queryKey: deliveryKeys.active() });
      }
    },
  });
};
