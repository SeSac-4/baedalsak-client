import type { ReactNode } from 'react';
import { Link } from 'react-router';

import type { OrderDetail } from '@/entities/order';
import { formatPrice, formatTime } from '@/shared/lib/format';
import { Card } from '@/shared/ui/card';
import { KeyValueList, type KeyValueItem } from '@/shared/ui/key-value-list';

export interface OrderInfoCardProps {
  order: OrderDetail;
  /** 결제 상세 경로. 돈이 나간 결제가 있을 때만 넘긴다 */
  paymentDetailPath?: string;
}

/**
 * 요청사항 목록을 만든다. 없는 요청은 뺀다.
 * @param order 주문 상세
 * @returns 라벨·값 목록
 */
const getRequestItems = (order: OrderDetail): KeyValueItem[] => {
  const items: KeyValueItem[] = [];
  if (order.storeRequest) items.push({ label: '가게', value: order.storeRequest });
  if (order.riderRequest) items.push({ label: '라이더', value: order.riderRequest });
  return items;
};

/**
 * 고객 주문 정보 카드 (U-09): 메뉴별 수량·금액, 요청사항, 가게·배달 주소·조리 완료 예상, 결제 금액, 결제 상세 링크.
 * @param props order(주문 상세), paymentDetailPath(결제 상세 경로)
 * @returns 주문 정보 카드 요소
 */
export function OrderInfoCard({ order, paymentDetailPath }: OrderInfoCardProps): ReactNode {
  const requestItems = getRequestItems(order);
  const infoItems: KeyValueItem[] = [
    { label: '가게', value: order.storeName },
    { label: '배달 주소', value: order.deliveryAddress },
    { label: '조리 완료', value: order.estimatedReadyAt ? `${formatTime(order.estimatedReadyAt)} 예상` : '수락 전' },
  ];

  return (
    <Card className='flex flex-col gap-3.5'>
      <div className='flex items-center'>
        <h2 className='flex-1 font-bold text-fg'>주문 정보</h2>
        <span className='text-note text-fg-muted tabular-nums'>#{order.id}</span>
      </div>
      <ul className='flex flex-col gap-2'>
        {order.items.map((item) => (
          <li
            key={item.menuId}
            className='flex gap-2'
          >
            <span className='min-w-0 flex-1 wrap-break-word text-fg'>{item.menuName}</span>
            <span className='flex-none text-fg-muted tabular-nums'>{item.quantity}개</span>
            <span className='min-w-19 flex-none text-right text-fg tabular-nums'>
              {formatPrice(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
      {requestItems.length > 0 ? (
        <KeyValueList
          variant='boxed'
          labelWidth={52}
          items={requestItems}
        />
      ) : null}
      <KeyValueList
        labelWidth={92}
        items={infoItems}
      />
      <dl className='grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 border-t border-border pt-3'>
        <dt className='text-fg-muted'>메뉴 합계</dt>
        <dd className='text-right text-fg tabular-nums'>{formatPrice(order.itemsAmount)}</dd>
        <dt className='text-fg-muted'>배달비</dt>
        <dd className='text-right text-fg tabular-nums'>{formatPrice(order.deliveryFee)}</dd>
      </dl>
      <div className='flex items-center justify-between border-t border-border pt-3'>
        <span className='font-bold text-fg'>결제 금액</span>
        <span className='text-title font-bold text-fg tabular-nums'>{formatPrice(order.totalAmount)}</span>
      </div>
      {paymentDetailPath ? (
        <Link
          to={paymentDetailPath}
          className='-mt-1.5 flex min-h-11 items-center justify-end text-note font-semibold text-role-ink hover:underline'
        >
          결제 상세 보기 ›
        </Link>
      ) : null}
    </Card>
  );
}
