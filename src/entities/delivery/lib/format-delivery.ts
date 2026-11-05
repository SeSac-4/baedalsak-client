import type { BadgeTone } from '@/shared/ui/badge';

import type { DeliveryStatus } from '../model/delivery-types';

const MINUTE_MS = 60_000;

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
