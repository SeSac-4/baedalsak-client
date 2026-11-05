import type { ReactNode } from 'react';

import type { WaitingDelivery } from '@/entities/delivery';
import { cn } from '@/shared/lib/cn';
import { MapBackdrop } from '@/shared/ui/map-backdrop';

/** 핀 자리 (지도 그림 좌표). 위치 API가 없어 목록 순서대로 시안의 자리에 놓는다 */
const PIN_SPOTS: { pin: [number, number]; area: [number, number] }[] = [
  { pin: [230, 80], area: [340, 190] },
  { pin: [330, 190], area: [440, 108] },
  { pin: [450, 135], area: [220, 170] },
];
const MY_SPOT: [number, number] = [150, 135];

export interface PickupMapProps {
  /** 배차 대기 배달 (앞에서부터 핀 자리 수만큼만 표시) */
  deliveries: WaitingDelivery[];
  /** 선택된 배달 순서 (0부터) */
  selectedIndex: number;
}

/**
 * 배차 대기 지도. 픽업 가게 핀(순번)과 선택된 요청의 배달 동 영역을 그린다. 실제 좌표가 없어 시안의 그림 위 고정 자리에 둔다.
 * @param props deliveries(배차 대기 배달), selectedIndex(선택된 순서)
 * @returns 지도 섹션 요소
 */
export function PickupMap({ deliveries, selectedIndex }: PickupMapProps): ReactNode {
  const pins = deliveries.slice(0, PIN_SPOTS.length);
  const selected = pins[selectedIndex];
  const selectedSpot = PIN_SPOTS[selectedIndex];

  return (
    <section
      aria-label='픽업 가게 지도'
      className='relative overflow-hidden rounded-card border border-border bg-surface'
    >
      <MapBackdrop
        label='배차 대기 중인 가게 위치'
        className='h-45'
      >
        {selected && selectedSpot ? (
          <>
            <rect
              x={selectedSpot.area[0] - 60}
              y={selectedSpot.area[1] - 26}
              width='120'
              height='52'
              rx='10'
              strokeDasharray='5 4'
              className='fill-role/10 stroke-role'
            />
            <text
              x={selectedSpot.area[0]}
              y={selectedSpot.area[1] + 4}
              textAnchor='middle'
              className='fill-role-ink text-[12px] font-semibold'
            >
              {selected.deliveryDong}
            </text>
            <path
              d={`M${selectedSpot.pin[0]} ${selectedSpot.pin[1]}L${selectedSpot.area[0]} ${selectedSpot.area[1]}`}
              strokeWidth='1.5'
              strokeDasharray='4 4'
              className='fill-none stroke-role'
            />
          </>
        ) : null}
        {pins.map((delivery, index) => {
          const isSelected = index === selectedIndex;
          const [x, y] = PIN_SPOTS[index]?.pin ?? [0, 0];

          return (
            <g
              key={delivery.deliveryId}
              transform={`translate(${x} ${y})`}
            >
              <circle
                r={isSelected ? 14 : 11}
                strokeWidth={isSelected ? 3 : 2.5}
                className={isSelected ? 'fill-role stroke-surface' : 'fill-surface stroke-role'}
              />
              <text
                y='4.5'
                textAnchor='middle'
                className={cn('text-[12px] font-bold', isSelected ? 'fill-role-on' : 'fill-role')}
              >
                {index + 1}
              </text>
            </g>
          );
        })}
        <g transform={`translate(${MY_SPOT[0]} ${MY_SPOT[1]})`}>
          <circle
            r='16'
            className='fill-fg/12'
          />
          <circle
            r='7'
            strokeWidth='2.5'
            className='fill-fg stroke-surface'
          />
        </g>
      </MapBackdrop>
      <div className='absolute bottom-2.5 left-2.5 flex items-center gap-2.5 rounded-md border border-border bg-surface px-2.25 py-0.5 text-note text-fg-muted'>
        <span className='inline-flex items-center gap-1.25'>
          <span className='size-2 rounded-full bg-fg' />내 위치
        </span>
        <span className='inline-flex items-center gap-1.25'>
          <span className='size-2.25 rounded-full bg-role' />
          픽업 가게
        </span>
        <span className='inline-flex items-center gap-1.25'>
          <span className='h-2 w-2.75 rounded-xs border border-dashed border-role' />
          배달 동
        </span>
      </div>
    </section>
  );
}
