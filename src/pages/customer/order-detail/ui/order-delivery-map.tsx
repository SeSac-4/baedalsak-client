import type { ReactNode } from 'react';

import type { Delivery } from '@/entities/delivery';
import type { OrderDetail } from '@/entities/order';
import { useStore } from '@/entities/store';
import { DeliveryMap } from '@/widgets/delivery-map';

export interface OrderDeliveryMapProps {
  order: OrderDetail;
  /** 배정 이후(ASSIGNED·PICKED_UP·DELIVERED) 배달 */
  delivery: Delivery;
}

/**
 * 고객 주문 상세의 배달 지도. 배정 후 가게·배달지를, 픽업 중에는 경로선·라이더 위치(2초 갱신)를 함께 보여 준다.
 * 가게 주소는 가게 상세에서 가져온다 (서버 좌표가 없을 때만 쓴다).
 * @param props order(주문 상세), delivery(배달 정보)
 * @returns 지도 요소
 */
export function OrderDeliveryMap({ order, delivery }: OrderDeliveryMapProps): ReactNode {
  const { data: store } = useStore(delivery.pickupPoint ? 0 : order.storeId);

  return (
    <DeliveryMap
      storeAddress={store?.address}
      deliveryAddress={order.deliveryAddress}
      status={delivery.status}
      orderId={order.id}
      pickupPoint={delivery.pickupPoint}
      deliveryPoint={delivery.deliveryPoint}
      className='h-55 tablet:h-75 desktop:h-75'
    />
  );
}
