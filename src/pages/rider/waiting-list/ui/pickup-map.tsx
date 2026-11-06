import type { ReactNode } from 'react';

import type { WaitingDelivery } from '@/entities/delivery';
import { useAddressCoords } from '@/shared/lib/kakao-map';
import { KakaoMap, type KakaoMapMarker } from '@/shared/ui/kakao-map';

export interface PickupMapProps {
  /** 배차 대기 배달 */
  deliveries: WaitingDelivery[];
  /** 선택된 배달 순서 (0부터) */
  selectedIndex: number;
  /** 지도 핀을 눌러 배달을 고를 때 */
  onSelect: (index: number) => void;
}

/**
 * 배차 대기 지도 (카카오맵). 픽업 주소를 좌표로 바꿔 순번 핀을 찍고, 선택된 요청을 강조한다.
 * 배달지는 수락 전이라 동 단위만 알 수 있어 표시하지 않는다. 좌표를 못 찾은 주소는 빼고 그린다.
 * @param props deliveries(배차 대기 배달), selectedIndex(선택된 순서), onSelect(핀 선택)
 * @returns 지도 섹션 요소
 */
export function PickupMap({ deliveries, selectedIndex, onSelect }: PickupMapProps): ReactNode {
  const { coords } = useAddressCoords(deliveries.map((delivery) => delivery.pickupAddress));

  const markers: KakaoMapMarker[] = deliveries.flatMap((delivery, index) => {
    const position = coords[index];
    if (!position) return [];
    const isSelected = index === selectedIndex;
    return [
      {
        id: delivery.deliveryId,
        position,
        label: String(index + 1),
        tone: isSelected ? 'role' : 'outline',
        emphasized: isSelected,
        onClick: () => onSelect(index),
      },
    ];
  });

  return (
    <section
      aria-label='픽업 가게 지도'
      className='relative overflow-hidden rounded-card border border-border bg-surface'
    >
      <KakaoMap
        markers={markers}
        label='배차 대기 중인 가게 위치'
        className='h-45 tablet:h-60'
      />
      <div className='absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.25 rounded-md border border-border bg-surface px-2.25 py-0.5 text-note text-fg-muted'>
        <span className='size-2.25 rounded-full bg-role' />
        픽업 가게 (번호 = 목록 순서)
      </div>
    </section>
  );
}
