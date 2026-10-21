import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, formatOrderItems } from '../lib/format-order';
import type { OrderSummary } from '../model/order-types';

/** CMP-19 OrderCard — 제목·상태 배지·메뉴 요약·금액·시각 + 역할별 푸터 슬롯. */
export interface OrderCardProps {
  order: OrderSummary;
  /** 카드 제목 (기본: 가게명, 사장님 화면은 주문번호) */
  title?: ReactNode;
  footer?: ReactNode;
  interactive?: boolean;
  className?: string;
}

/**
 * 주문 목록 항목 카드를 렌더링한다.
 * @param props order(주문 요약), title(제목), footer(하단 동작 영역), interactive(hover 강조)
 * @returns 주문 카드 요소
 */
export function OrderCard({ order, title, footer, interactive = false, className }: OrderCardProps): ReactNode {
  return (
    <Card
      interactive={interactive}
      className={cn('flex flex-col gap-1.5', className)}
    >
      <div className='flex items-start justify-between gap-2'>
        <strong className='text-base text-fg'>{title ?? order.storeName}</strong>
        <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
      </div>
      <span className='truncate text-note text-fg-muted'>{formatOrderItems(order.items)}</span>
      <div className='flex items-center justify-between gap-2 text-note tabular-nums'>
        <span className='text-fg-subtle'>
          #{order.id} · {formatDateTime(order.createdAt)}
        </span>
        <strong className='text-body text-fg'>{formatPrice(order.totalAmount)}</strong>
      </div>
      {footer ? <div className='mt-1'>{footer}</div> : null}
    </Card>
  );
}
