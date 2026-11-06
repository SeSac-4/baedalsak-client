import type { ReactNode } from 'react';

import type { Delivery } from '@/entities/delivery';
import type { OrderDetail } from '@/entities/order';
import { useStore } from '@/entities/store';
import { DeliveryMap } from '@/widgets/delivery-map';

export interface OrderDeliveryMapProps {
  order: OrderDetail;
  /** 배달 정보 (배달 생성 전이면 null, 불러오는 중·실패면 undefined) */
  delivery: Delivery | null | undefined;
}

/**
 * 고객 주문 상세의 배달 지도. 픽업 후(PICKED_UP)에만 가게·배달지와 경로선·라이더 위치(2초 갱신)를 보여 준다. 가게 주소는 가게 상세에서 가져온다.
 * @param props order(주문 상세), delivery(배달 정보)
 * @returns 지도 요소 (픽업 전·완료 후면 null)
 */
export function OrderDeliveryMap({ order, delivery }: OrderDeliveryMapProps): ReactNode {
  const isPickedUp = delivery?.status === 'PICKED_UP';
  const { data: store } = useStore(isPickedUp ? order.storeId : 0);

  if (!isPickedUp) return null;

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
