import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { deliveryKeys, type RiderDelivery } from '@/entities/delivery';
import { getErrorCode, getErrorMessage } from '@/shared/api';
import { useToast } from '@/shared/ui/toast';

import { acceptDelivery } from '../api/waiting-list-api';

const ACTIVE_DELIVERY_PATH = '/rider/active';
const DELIVERY_ALREADY_ASSIGNED = 'DELIVERY_ALREADY_ASSIGNED';
const DELIVERY_INVALID_STATUS = 'DELIVERY_INVALID_STATUS';

/**
 * 배차 수락. 성공하면 진행 중 배달 화면으로 이동한다.
 * 다른 라이더가 먼저 수락했으면(409 DELIVERY_ALREADY_ASSIGNED) 안내 후 대기 목록을 다시 불러오고,
 * 이미 진행 중인 배달이 있으면(409 DELIVERY_INVALID_STATUS) 진행 중 배달 화면으로 보낸다.
 * @returns 배차 수락 mutation (인자: 배달 ID)
 */
export const useAcceptDelivery = (): UseMutationResult<RiderDelivery, unknown, number> => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: acceptDelivery,
    onSuccess: async (): Promise<void> => {
      // 수락 응답에는 고객 연락처가 없어 진행 중 배달은 다시 조회한다
      await queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
      toast('배차를 수락했어요.');
      navigate(ACTIVE_DELIVERY_PATH);
    },
    onError: async (error: unknown): Promise<void> => {
      const code = getErrorCode(error);

      if (code === DELIVERY_ALREADY_ASSIGNED) {
        toast('이미 배차된 주문입니다.');
        await queryClient.invalidateQueries({ queryKey: deliveryKeys.waiting() });
        return;
      }

      if (code === DELIVERY_INVALID_STATUS) {
        toast('이미 진행 중인 배달이 있어요.');
        await queryClient.invalidateQueries({ queryKey: deliveryKeys.active() });
        navigate(ACTIVE_DELIVERY_PATH);
        return;
      }

      toast(getErrorMessage(error));
    },
  });
};
