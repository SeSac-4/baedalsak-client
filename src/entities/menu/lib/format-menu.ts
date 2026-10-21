import type { BadgeTone } from '@/shared/ui/badge';

import type { SaleStatus } from '../model/menu-types';

/** 판매 상태 표시명 */
export const SALE_STATUS_LABEL: Record<SaleStatus, string> = {
  ON_SALE: '판매 중',
  SOLD_OUT: '품절',
};

/** 판매 상태 배지 톤 (CMP-05) */
export const SALE_STATUS_TONE: Record<SaleStatus, BadgeTone> = {
  ON_SALE: 'ok',
  SOLD_OUT: 'muted',
};
