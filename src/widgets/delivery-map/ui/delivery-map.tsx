import type { ReactNode } from 'react';

import type { DeliveryStatus } from '@/entities/delivery';
import { cn } from '@/shared/lib/cn';
import { useAddressCoords, type LatLngLiteral } from '@/shared/lib/kakao-map';
import { KakaoMap, type KakaoMapMarker } from '@/shared/ui/kakao-map';

export interface DeliveryMapProps {
  /** 픽업지(가게) 주소. 아직 불러오는 중이면 undefined */
  storeAddress: string | undefined;
  /** 배달지 주소 */
  deliveryAddress: string;
  status: DeliveryStatus;
  /** 라이더 현재 위치. 픽업 후(PICKED_UP)에만 표시한다. 위치 API 연동 전에는 넘기지 않는다 */
  riderPosition?: LatLngLiteral | null;
  /** 높이 등 지도 영역 클래스 */
  className?: string;
}

interface StatusChip {
  text: string;
  isMoving: boolean;
}

const STATUS_CHIP: Record<DeliveryStatus, StatusChip> = {
  WAITING: { text: '라이더 배정 전', isMoving: false },
  ASSIGNED: { text: '가게로 이동 중', isMoving: true },
  PICKED_UP: { text: '배달지로 이동 중', isMoving: true },
  DELIVERED: { text: '배달 완료', isMoving: false },
};

/**
 * 지도에 찍을 표시를 만든다. 픽업 전에는 가게, 픽업 후에는 배달지(라이더 위치가 있으면 라이더)를 강조한다.
 * @param positions - 가게·배달지·라이더 좌표 (못 찾았으면 null)
 * @param status - 배달 상태
 * @returns 표시 목록
 */
const buildMarkers = (
  positions: { store: LatLngLiteral | null; home: LatLngLiteral | null; rider: LatLngLiteral | null },
  status: DeliveryStatus,
): KakaoMapMarker[] => {
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
 * 배달 지도 (카카오맵). 가게·배달지를 주소로 찾아 표시하고, 픽업 후에는 라이더 위치를 함께 보여 준다.
 * 라이더·고객·사장님 화면이 같이 쓴다. 도로 경로선은 경로 API 연동 때 추가한다.
 * @param props storeAddress, deliveryAddress, status, riderPosition, className
 * @returns 지도 섹션 요소
 */
export function DeliveryMap({
  storeAddress,
  deliveryAddress,
  status,
  riderPosition = null,
  className,
}: DeliveryMapProps): ReactNode {
  const addresses = storeAddress ? [storeAddress, deliveryAddress] : [deliveryAddress];
  const { coords } = useAddressCoords(addresses);
  const [store, home] = storeAddress ? coords : [null, coords[0]];
  const markers = buildMarkers({ store: store ?? null, home: home ?? null, rider: riderPosition }, status);
  const chip = STATUS_CHIP[status];

  return (
    <section
      aria-label='배달 지도'
      className='relative overflow-hidden rounded-card border border-border bg-surface'
    >
      <KakaoMap
        markers={markers}
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
    </section>
  );
}
