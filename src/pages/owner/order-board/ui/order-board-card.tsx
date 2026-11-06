import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, type OrderDetail } from '@/entities/order';
import { cn } from '@/shared/lib/cn';
import { formatDateTime, formatPrice, formatTime } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button, getButtonClassName } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { KeyValueList, type KeyValueItem } from '@/shared/ui/key-value-list';

export interface OrderBoardCardProps {
  order: OrderDetail;
  onAcceptClick: (order: OrderDetail) => void;
  onRejectClick: (order: OrderDetail) => void;
}

/**
 * 주문 카드의 정보 목록을 만든다. 조리 완료 시각은 수락한 주문에만 있다.
 * @param order - 주문
 * @returns 라벨·값 목록
 */
const getInfoItems = (order: OrderDetail): KeyValueItem[] => {
  const items: KeyValueItem[] = [
    { label: '배달 주소', value: order.deliveryAddress },
    {
      label: '가게 요청',
      value: order.storeRequest ?? <span className='text-fg-muted'>없음</span>,
    },
  ];
  if (!order.estimatedReadyAt) return items;

  const rider = order.riderName ? ` · 라이더 ${order.riderName}` : '';
  return [...items, { label: '조리 완료', value: `${formatTime(order.estimatedReadyAt)} 예상${rider}` }];
};

/**
 * 주문 관리 카드: 주문 번호·상태·시각, 메뉴, 배달 주소·요청, 금액과 상세·거절·수락. 거절·수락은 신규(결제완료) 주문에만 보여 준다.
 * @param props order(주문), onAcceptClick(수락), onRejectClick(거절)
 * @returns 주문 카드 요소
 */
export function OrderBoardCard({ order, onAcceptClick, onRejectClick }: OrderBoardCardProps): ReactNode {
  return (
    <Card
      padding='sm'
      className='flex flex-col gap-3'
    >
      <div className='flex items-center gap-2'>
        <span className='font-bold text-fg'>주문 #{order.id}</span>
        <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
        <span className='ml-auto text-note whitespace-nowrap text-fg-muted tabular-nums'>
          {formatDateTime(order.createdAt)}
        </span>
      </div>
      <ul className='flex flex-col gap-1'>
        {order.items.map((item) => (
          <li
            key={item.menuId}
            className='flex gap-2'
          >
            <span className='min-w-0 flex-1 text-fg'>{item.menuName}</span>
            <span className='text-fg-muted tabular-nums'>{item.quantity}개</span>
          </li>
        ))}
      </ul>
      <KeyValueList
        size='note'
        labelWidth={76}
        items={getInfoItems(order)}
        className='border-t border-border pt-2.5'
      />
      <div className='flex flex-wrap items-center justify-end gap-2'>
        <span className='flex-1 text-title font-bold whitespace-nowrap text-fg tabular-nums'>
          {formatPrice(order.totalAmount)}
        </span>
        <div className='flex items-center gap-2'>
          <Link
            to={`/owner/orders/${order.id}`}
            aria-label={`주문 ${order.id} 상세`}
            className={cn(getButtonClassName({ variant: 'secondary' }), 'px-3.5')}
          >
            상세
          </Link>
          {order.status === 'PAID' ? (
            <>
              <Button
                variant='danger-secondary'
                aria-label={`주문 ${order.id} 거절`}
                className='px-3.5'
                onClick={() => onRejectClick(order)}
              >
                거절
              </Button>
              <Button
                aria-label={`주문 ${order.id} 수락`}
                onClick={() => onAcceptClick(order)}
              >
                수락
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
