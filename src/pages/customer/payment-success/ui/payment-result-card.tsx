import type { ReactNode } from 'react';
import { Link } from 'react-router';

import type { OrderDetail } from '@/entities/order';
import { usePaymentByOrder } from '@/entities/payment';
import { formatPrice } from '@/shared/lib/format';
import { Card } from '@/shared/ui/card';
import { KeyValueList } from '@/shared/ui/key-value-list';

const PRIMARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg bg-role px-4 text-body font-medium text-role-on transition hover:brightness-110';
const SECONDARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg border border-border bg-surface px-4 text-body font-medium text-fg transition hover:bg-surface-hover';

export interface PaymentResultCardProps {
  /** 결제 확인 응답 (결제완료된 주문) */
  order: OrderDetail;
}

/**
 * U-06 결제 완료 결과. 주문번호·가게·결제 금액·결제수단·승인번호와 주문 상세·홈 버튼을 보여 준다.
 * 결제수단·승인번호는 주문의 결제(GET /payments/by-order/{orderId})에서 읽고, 불러오기 전이거나 값이 없으면 '-'로 보여 준다
 * (승인번호는 카드 결제에만 있어 결제마다 항목 구성을 같게 유지).
 * @param props order(결제완료된 주문)
 * @returns 결제 완료 결과 요소
 */
export function PaymentResultCard({ order }: PaymentResultCardProps): ReactNode {
  const { data: payment } = usePaymentByOrder(order.id);

  return (
    <div className='mx-auto flex max-w-[520px] flex-col items-center gap-4 px-4 py-6 text-center'>
      <div
        aria-hidden
        className='flex size-14 items-center justify-center rounded-full bg-ok-soft text-title font-bold text-ok'
      >
        ✓
      </div>
      <div className='flex flex-col gap-1'>
        <h2 className='text-title font-bold text-fg'>결제가 완료되었어요</h2>
        <p className='text-body text-fg-muted'>가게에서 주문을 확인하면 조리가 시작돼요.</p>
      </div>
      <Card className='w-full text-left'>
        <KeyValueList
          className='tabular-nums'
          items={[
            { label: '주문번호', value: order.id },
            { label: '가게', value: order.storeName },
            { label: '결제 금액', value: formatPrice(order.totalAmount) },
            { label: '결제수단', value: payment?.method ?? '-' },
            { label: '승인번호', value: payment?.approvalNumber ?? '-' },
          ]}
        />
      </Card>
      <div className='flex flex-wrap justify-center gap-2'>
        <Link
          to={`/orders/${order.id}`}
          className={PRIMARY_LINK_CLASS}
        >
          주문 상세 보기
        </Link>
        <Link
          to='/'
          className={SECONDARY_LINK_CLASS}
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
