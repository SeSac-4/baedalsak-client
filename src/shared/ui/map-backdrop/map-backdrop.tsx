import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface MapBackdropProps {
  /** 스크린리더용 지도 설명 (예: '가게에서 배달지까지 지도') */
  label: string;
  /** 높이 등 svg 클래스 */
  className?: string;
  /** 지도 위에 얹는 핀·경로 (640×260 좌표) */
  children?: ReactNode;
}

/**
 * 시안의 지도 그림(도로·서울숲·중랑천). 실제 지도 연동 전까지 배경으로 쓴다. 좁은 화면에서는 가운데를 기준으로 잘린다.
 * @param props label, className, children(위에 얹는 표시)
 * @returns svg 요소
 */
export function MapBackdrop({ label, className, children }: MapBackdropProps): ReactNode {
  return (
    <svg
      role='img'
      aria-label={label}
      viewBox='0 0 640 260'
      preserveAspectRatio='xMidYMid slice'
      className={cn('block w-full', className)}
    >
      <rect
        width='640'
        height='260'
        className='fill-track'
      />
      <rect
        x='470'
        width='170'
        height='70'
        rx='4'
        className='fill-map-park'
      />
      <rect
        y='228'
        width='640'
        height='32'
        className='fill-map-water'
      />
      <path
        d='M0 80H640M0 190H640M100 0V228M200 0V228M300 0V228M450 0V228M560 70V228'
        strokeWidth='12'
        strokeLinecap='round'
        className='fill-none stroke-map-road'
      />
      <path
        d='M0 30H470M0 135H640M30 0V228M250 0V228M380 0V228M510 70V228'
        strokeWidth='5'
        className='fill-none stroke-map-road'
      />
      <text
        x='520'
        y='40'
        textAnchor='middle'
        className='fill-map-park-ink text-[11px]'
      >
        서울숲
      </text>
      <text
        x='320'
        y='249'
        textAnchor='middle'
        className='fill-map-water-ink text-[11px]'
      >
        중랑천
      </text>
      {children}
    </svg>
  );
}
