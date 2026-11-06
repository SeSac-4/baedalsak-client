import type { BadgeTone } from '@/shared/ui/badge';

import type { PaymentStatus } from '../model/payment-types';

/** 결제 상태 표시명 */
export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  REQUESTED: '결제 요청',
  APPROVED: '승인 완료',
  CANCEL_REQUESTED: '환불 처리 중',
  CANCELED: '환불 완료',
  EXPIRED: '결제 만료',
};

/** 결제 상태 배지 톤 (CMP-05) */
export const PAYMENT_STATUS_TONE: Record<PaymentStatus, BadgeTone> = {
  REQUESTED: 'warn',
  APPROVED: 'ok',
  CANCEL_REQUESTED: 'warn',
  CANCELED: 'muted',
  EXPIRED: 'muted',
};
