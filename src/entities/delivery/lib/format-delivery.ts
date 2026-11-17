import type { BadgeTone } from '@/shared/ui/badge';

import type { DeliveryStatus, WaitingDelivery } from '../model/delivery-types';

const MINUTE_MS = 60_000;
const MINUTE_S = 60;

/** 배차 대기 예상 시간 표시값 (분) */
export interface WaitingEta {
  /** 배달 완료까지 */
  totalMinutes: number;
  /** 출발 전 기다리는 쪽: 조리 대기 또는 가게까지 이동 (더 긴 쪽) */
  waitLabel: '조리 대기' | '가게까지';
  waitMinutes: number;
  /** 가게 → 배달지 */
  deliveryMinutes: number;
  /** 내 위치 → 가게. 모르면 null */
  pickupMinutes: number | null;
}

/**
 * 초를 분으로 바꾼다. 1분 미만은 1분.
 * @param seconds - 초
 * @returns 분 (올림, 최소 1)
 */
const toMinutes = (seconds: number): number => Math.max(1, Math.ceil(seconds / MINUTE_S));

/**
 * 배차 대기 예상 시간을 표시용 분으로 바꾼다. 배달 완료까지 = max(조리 대기, 가게까지) + 배달.
 * @param delivery - 배차 대기 배달
 * @returns 예상 시간 (서버가 계산하지 못했으면 null)
 */
export const getWaitingEta = (delivery: WaitingDelivery): WaitingEta | null => {
  const { totalDurationS, deliveryDurationS, pickupDurationS } = delivery;
  if (totalDurationS == null || deliveryDurationS == null) return null;
  const waitS = totalDurationS - deliveryDurationS;
  const isPickupLonger = pickupDurationS != null && pickupDurationS >= waitS && pickupDurationS > 0;
  return {
    totalMinutes: toMinutes(totalDurationS),
    waitLabel: isPickupLonger ? '가게까지' : '조리 대기',
    waitMinutes: Math.ceil(waitS / MINUTE_S),
    deliveryMinutes: toMinutes(deliveryDurationS),
    pickupMinutes: pickupDurationS == null ? null : toMinutes(pickupDurationS),
  };
};

/** 배달 상태 표시명 */
export const DELIVERY_STATUS_LABEL: Record<DeliveryStatus, string> = {
  WAITING: '배차 대기',
  ASSIGNED: '배차 완료',
  PICKED_UP: '픽업 완료',
  DELIVERED: '배달 완료',
};

/** 배달 상태 배지 톤 (CMP-05) */
export const DELIVERY_STATUS_TONE: Record<DeliveryStatus, BadgeTone> = {
  WAITING: 'warn',
  ASSIGNED: 'info',
  PICKED_UP: 'info',
  DELIVERED: 'ok',
};

/**
 * 조리 완료 예상 시각까지 남은 분을 구한다. 지났으면 0.
 * @param estimatedReadyAt ISO 8601 조리 완료 예상 시각
 * @returns 남은 분 (올림)
 */
export const getReadyMinutesLeft = (estimatedReadyAt: string): number =>
  Math.max(0, Math.ceil((new Date(estimatedReadyAt).getTime() - Date.now()) / MINUTE_MS));
