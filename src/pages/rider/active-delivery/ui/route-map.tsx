import type { ReactNode } from 'react';

import type { DeliveryStatus } from '@/entities/delivery';
import { cn } from '@/shared/lib/cn';
import { MapBackdrop } from '@/shared/ui/map-backdrop';

/** 시안의 가게 → 배달지 경로 (지도 그림 좌표). 위치 API가 없어 고정 그림으로 둔다 */
const ROUTE_PATH = 'M200 190V80H300V130H380V80H450V190';
const ROUTE_DONE_PATH = 'M200 190V80H300V130H353.5';
const STORE_SPOT = 'translate(200 190)';
const HOME_SPOT = 'translate(450 190)';
const RIDER_SPOT = 'translate(353.5 130)';

export interface RouteMapProps {
  status: DeliveryStatus;
}

/**
 * 진행 중 배달 지도. 배차 완료면 가게를, 픽업 완료면 경로와 라이더 위치를 강조한다.
 * 실제 위치가 아니라 시안의 그림이며, 실시간 위치 연동 때 카카오맵으로 바꾼다.
 * @param props status(배달 상태)
 * @returns 지도 섹션 요소
 */
export function RouteMap({ status }: RouteMapProps): ReactNode {
  const isPickedUp = status === 'PICKED_UP';

  return (
    <section
      aria-label='배달 지도'
      className='relative overflow-hidden rounded-card border border-border bg-surface'
    >
      <MapBackdrop
        label='가게에서 배달지까지 지도'
        className='h-60 tablet:h-80 desktop:h-115'
      >
        {isPickedUp ? (
          <>
            <path
              d={ROUTE_PATH}
              strokeWidth='7'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='fill-none stroke-role-light'
            />
            <path
              d={ROUTE_DONE_PATH}
              strokeWidth='7'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='fill-none stroke-role'
            />
          </>
        ) : null}
        <g transform={STORE_SPOT}>
          {isPickedUp ? null : (
            <circle
              r='26'
              className='fill-role/14'
            />
          )}
          <circle
            r='17'
            strokeWidth='2.5'
            className={cn('fill-surface', isPickedUp ? 'stroke-fg' : 'stroke-role')}
          />
          <text
            y='4.5'
            textAnchor='middle'
            className='fill-fg text-[12px] font-bold'
          >
            가게
          </text>
        </g>
        <g transform={HOME_SPOT}>
          <circle
            r='17'
            strokeWidth='2.5'
            className={cn('fill-surface', isPickedUp ? 'stroke-role' : 'stroke-fg')}
          />
          <text
            y='4.5'
            textAnchor='middle'
            className='fill-fg text-[12px] font-bold'
          >
            집
          </text>
        </g>
        {isPickedUp ? (
          <g transform={RIDER_SPOT}>
            <circle
              r='19'
              className='fill-role/18'
            />
            <circle
              r='10'
              strokeWidth='3'
              className='fill-role stroke-surface'
            />
          </g>
        ) : null}
      </MapBackdrop>
      <span
        className={cn(
          'absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.25 py-0.5 text-note',
          isPickedUp ? 'text-role-ink' : 'text-fg-muted',
        )}
      >
        <span className={cn('size-1.75 rounded-full', isPickedUp ? 'bg-ok-dot' : 'bg-fg-subtle')} />
        {isPickedUp ? '배달지로 이동 중' : '가게로 이동 중'}
      </span>
    </section>
  );
}
