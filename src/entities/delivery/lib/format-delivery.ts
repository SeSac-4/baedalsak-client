import type { BadgeTone } from '@/shared/ui/badge';

import type { DeliveryStatus } from '../model/delivery-types';

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
