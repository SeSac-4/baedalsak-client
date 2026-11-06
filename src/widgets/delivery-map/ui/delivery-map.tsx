import type { ReactNode } from 'react';

import {
  formatRemaining,
  useDeliveryLocation,
  useDeliveryRoute,
  type DeliveryPoint,
  type DeliveryStatus,
} from '@/entities/delivery';
import { cn } from '@/shared/lib/cn';
import { useAddressCoords, type LatLngLiteral } from '@/shared/lib/kakao-map';
import { KakaoMap, type KakaoMapMarker } from '@/shared/ui/kakao-map';

export interface DeliveryMapProps {
  /** 픽업지(가게) 주소. 아직 불러오는 중이면 undefined */
  storeAddress: string | undefined;
  /** 배달지 주소 */
  deliveryAddress: string;
  status: DeliveryStatus;
  /** 주문 ID. 있으면 픽업 중 경로선·라이더 위치를 서버에서 받아 2초마다 갱신한다 */
  orderId?: number;
  /** 서버가 준 가게 좌표. 있으면 주소 변환을 건너뛴다 */
  pickupPoint?: DeliveryPoint | null;
  /** 서버가 준 배달지 좌표. 있으면 주소 변환을 건너뛴다 */
  deliveryPoint?: DeliveryPoint | null;
  /** 라이더 위치를 직접 넘길 때 (갤러리 데모). 넘기면 서버 위치 대신 쓴다 */
  riderPosition?: LatLngLiteral | null;
  /** 경로선을 직접 넘길 때 (갤러리 데모). 넘기면 서버 경로 대신 쓴다 */
  routePath?: LatLngLiteral[];
  /** 높이 등 지도 영역 클래스 */
  className?: string;
}

interface StatusChip {
  text: string;
  isMoving: boolean;
}

interface MarkerPositions {
  store: LatLngLiteral | null;
  home: LatLngLiteral | null;
  rider: LatLngLiteral | null;
}

const STATUS_CHIP: Record<DeliveryStatus, StatusChip> = {
  WAITING: { text: '라이더 배정 전', isMoving: false },
  ASSIGNED: { text: '가게로 이동 중', isMoving: true },
  PICKED_UP: { text: '배달지로 이동 중', isMoving: true },
  DELIVERED: { text: '배달 완료', isMoving: false },
};

const ARRIVED_CHIP: StatusChip = { text: '배달지 도착', isMoving: false };

/**
 * 지도에 찍을 표시를 만든다. 픽업 전에는 가게, 픽업 후에는 배달지(라이더 위치가 있으면 라이더)를 강조한다.
 * @param positions - 가게·배달지·라이더 좌표 (모르면 null)
 * @param status - 배달 상태
 * @returns 표시 목록
 */
const buildMarkers = (positions: MarkerPositions, status: DeliveryStatus): KakaoMapMarker[] => {
  const isPickedUp = status === 'PICKED_UP' || status === 'DELIVERED';
  const rider = status === 'PICKED_UP' ? positions.rider : null;
  const markers: KakaoMapMarker[] = [];

  if (positions.store) {
    markers.push({
      id: 'store',
      position: positions.store,
      label: '가게',
      tone: isPickedUp ? 'plain' : 'role',
      emphasized: !isPickedUp,
    });
  }
  if (positions.home) {
    markers.push({
      id: 'home',
      position: positions.home,
      label: '집',
      tone: !isPickedUp ? 'plain' : rider ? 'outline' : 'role',
      emphasized: isPickedUp && !rider,
    });
  }
  if (rider) {
    markers.push({ id: 'rider', position: rider, label: '라이더', tone: 'role', emphasized: true });
  }
  return markers;
};

/**
 * 주소 변환이 필요한 주소만 고른다. 서버 좌표가 있으면 변환하지 않는다.
 * @param targets - 주소와 서버 좌표
 * @returns 변환할 주소 목록
 */
const getAddressesToGeocode = (targets: { address: string | undefined; point: DeliveryPoint | null }[]): string[] =>
  targets.flatMap(({ address, point }) => (!point && address ? [address] : []));

/**
 * 배달 지도 (카카오맵). 라이더·고객·사장님 화면이 같이 쓴다.
 * 가게·배달지는 서버 좌표를 쓰고, 없으면 주소로 찾는다. orderId 를 넘기면 픽업 중에
 * 도로 경로선과 라이더 위치(2초 폴링), 남은 거리·시간을 함께 보여 준다.
 * @param props storeAddress, deliveryAddress, status, orderId, pickupPoint, deliveryPoint, riderPosition, routePath, className
 * @returns 지도 섹션 요소
 */
export function DeliveryMap({
  storeAddress,
  deliveryAddress,
  status,
  orderId = 0,
  pickupPoint = null,
  deliveryPoint = null,
  riderPosition,
  routePath,
  className,
}: DeliveryMapProps): ReactNode {
  const isPickedUp = status === 'PICKED_UP';
  const isLive = orderId > 0 && riderPosition === undefined;
  const { data: route } = useDeliveryRoute(orderId, isLive && isPickedUp && routePath === undefined);
  const { data: tracking } = useDeliveryLocation(orderId, isLive && status !== 'DELIVERED');

  const addresses = getAddressesToGeocode([
    { address: storeAddress, point: pickupPoint },
    { address: deliveryAddress, point: deliveryPoint },
  ]);
  const { coords } = useAddressCoords(addresses);
  const geocoded = new Map(addresses.map((address, index) => [address, coords[index] ?? null]));
  const store = pickupPoint ?? (storeAddress ? (geocoded.get(storeAddress) ?? null) : null);
  const home = deliveryPoint ?? geocoded.get(deliveryAddress) ?? null;

  const location = isLive && isPickedUp ? (tracking?.location ?? null) : null;
  const rider =
    riderPosition !== undefined ? riderPosition : location ? { lat: location.lat, lng: location.lng } : null;
  const path = isPickedUp ? (routePath ?? route?.path) : undefined;
  const markers = buildMarkers({ store, home, rider }, status);
  const chip = location?.arrived ? ARRIVED_CHIP : STATUS_CHIP[status];
  const remaining = location ? formatRemaining(location) : null;

  return (
    <section
      aria-label='배달 지도'
      className='relative overflow-hidden rounded-card border border-border bg-surface'
    >
      <KakaoMap
        markers={markers}
        path={path}
        pathStyle={route?.straight ? 'dashed' : 'solid'}
        label='가게에서 배달지까지 지도'
        className={cn('h-60 tablet:h-80 desktop:h-115', className)}
      />
      <span
        className={cn(
          'absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.25 py-0.5 text-note',
          chip.isMoving ? 'text-role-ink' : 'text-fg-muted',
        )}
      >
        <span className={cn('size-1.75 rounded-full', chip.isMoving ? 'bg-ok-dot' : 'bg-fg-subtle')} />
        {chip.text}
      </span>
      {remaining ? (
        <p className='absolute top-2.5 right-2.5 z-10 rounded-md border border-border bg-surface px-2.5 py-1 text-note font-bold text-fg tabular-nums'>
          {remaining}
        </p>
      ) : null}
    </section>
  );
}
