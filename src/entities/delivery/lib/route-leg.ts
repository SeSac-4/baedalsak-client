import type { DeliveryStatus, RiderLocation, RouteLeg } from '../model/delivery-types';

/**
 * 배달 상태로 라이더가 가고 있는 구간을 구한다.
 * @param status - 배달 상태
 * @returns 배차 완료면 TO_STORE (라이더 → 가게), 그 밖에는 TO_CUSTOMER (가게 → 배달지)
 */
export const getRouteLeg = (status: DeliveryStatus): RouteLeg => (status === 'ASSIGNED' ? 'TO_STORE' : 'TO_CUSTOMER');

/**
 * 위치가 그 구간의 위치인지 확인한다. 픽업 직후 폴링 캐시에 남은 가게까지 위치(도착 표시 등)를 배달지까지 구간에 쓰지 않으려고 쓴다.
 * @param location - 라이더 위치
 * @param leg - 지금 구간
 * @returns 같은 구간이면 true (구간 구분 전 위치는 배달지까지로 본다)
 */
export const isLocationOnLeg = (location: RiderLocation, leg: RouteLeg): boolean =>
  (location.leg ?? 'TO_CUSTOMER') === leg;
