import type { BadgeTone } from '@/shared/ui/badge';

import type { PaymentStatus } from '../model/payment-types';

/** 결제 상태 표시명 */
export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  REQUESTED: '결제 요청',
  APPROVED: '승인 완료',
};

/** 결제 상태 배지 톤 (CMP-05) */
export const PAYMENT_STATUS_TONE: Record<PaymentStatus, BadgeTone> = {
  REQUESTED: 'warn',
  APPROVED: 'ok',
};
