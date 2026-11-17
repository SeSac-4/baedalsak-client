import type { ReactNode } from 'react';

import type { Delivery } from '@/entities/delivery';
import type { OrderDetail } from '@/entities/order';
import { useMyStore } from '@/entities/store';
import { DeliveryMap } from '@/widgets/delivery-map';

export interface OrderDeliveryMapProps {
  order: OrderDetail;
  /** 배달 정보 (배달 생성 전이면 null, 불러오는 중·실패면 undefined) */
  delivery: Delivery | null | undefined;
}

/**
 * 사장님 주문 상세의 배달 지도. 라이더가 움직이는 동안(배차 완료·픽업 중)에만 경로선·라이더 위치(2초 갱신)를 보여 준다.
 * 배차 완료면 라이더 → 가게, 픽업 중이면 가게 → 배달지. 가게 주소는 내 가게 캐시를 쓴다.
 * @param props order(주문 상세), delivery(배달 정보)
 * @returns 지도 요소 (배차 전·완료 후면 null)
 */
export function OrderDeliveryMap({ order, delivery }: OrderDeliveryMapProps): ReactNode {
  const { data: store } = useMyStore();

  if (delivery?.status !== 'ASSIGNED' && delivery?.status !== 'PICKED_UP') return null;

  return (
    <DeliveryMap
      storeAddress={store?.address}
      deliveryAddress={order.deliveryAddress}
      status={delivery.status}
      orderId={order.id}
      pickupPoint={delivery.pickupPoint}
      deliveryPoint={delivery.deliveryPoint}
    />
  );
}
