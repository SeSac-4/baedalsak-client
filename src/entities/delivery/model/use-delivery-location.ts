import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getDeliveryLocation } from '../api/delivery-api';
import { deliveryKeys } from '../api/delivery-query';
import type { Delivery, DeliveryLocation, DeliveryStatus, RiderDelivery } from './delivery-types';

/** 픽업 중 위치 폴링 주기. 서버 가상 GPS 갱신 주기(2초)와 같다 */
const MOVING_POLL_MS = 2_000;
/** 픽업 전에는 위치가 없으므로 상태 변화(픽업)만 느리게 확인한다 */
const WAITING_POLL_MS = 10_000;

/**
 * 상태별 폴링 주기를 고른다. 배달이 끝났으면 멈춘다.
 * @param status - 마지막으로 받은 배달 상태
 * @returns 주기 (ms) 또는 false
 */
const getPollInterval = (status: DeliveryStatus | undefined): number | false => {
  if (status === 'PICKED_UP') return MOVING_POLL_MS;
  if (status === 'DELIVERED') return false;
  return WAITING_POLL_MS;
};

/**
 * 주문의 라이더 위치를 폴링한다. 고객·사장님·라이더 화면, 지도·안내 문구가 같은 캐시를 써서 요청은 한 번만 나간다.
 * 픽업 중에는 2초, 픽업 전에는 10초마다 묻고, 완료되면 멈춘다.
 * 응답의 배달 상태가 화면에 있는 상태와 다르면(픽업·완료) 배달 상세·진행 중 배달을 다시 불러 화면 전체를 맞춘다.
 * @param orderId - 주문 ID
 * @param enabled - 폴링 여부 (배달이 있고 끝나지 않았을 때만 켠다)
 * @returns 상태 + 위치 쿼리 결과 (배달 생성 전이면 data가 null)
 */
export const useDeliveryLocation = (orderId: number, enabled: boolean): UseQueryResult<DeliveryLocation | null> => {
  const queryClient = useQueryClient();
  const result = useQuery({
    queryKey: deliveryKeys.location(orderId),
    queryFn: () => getDeliveryLocation(orderId),
    enabled: enabled && Number.isInteger(orderId) && orderId > 0,
    refetchInterval: (query) => getPollInterval(query.state.data?.status),
  });
  const polledStatus = result.data?.status;

  useEffect(() => {
    if (!polledStatus) return;
    const shown =
      queryClient.getQueryData<Delivery | null>(deliveryKeys.byOrder(orderId))?.status ??
      queryClient.getQueryData<RiderDelivery | null>(deliveryKeys.active())?.status;
    if (shown === undefined || shown === polledStatus) return;
    void queryClient.invalidateQueries({ queryKey: deliveryKeys.byOrder(orderId) });
    void queryClient.invalidateQueries({ queryKey: deliveryKeys.active() });
  }, [polledStatus, orderId, queryClient]);

  return result;
};
