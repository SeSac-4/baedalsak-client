import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { loadKakaoMap, type LatLngLiteral } from '@/shared/lib/kakao-map';

/** 기본 중심 (성수동). 표시할 표시가 없을 때 쓴다 */
const DEFAULT_CENTER: LatLngLiteral = { lat: 37.5446, lng: 127.0559 };
const DEFAULT_LEVEL = 4;
/** 표시가 하나뿐일 때 확대 수준 */
const SINGLE_MARKER_LEVEL = 3;
/** 표시들을 화면에 맞출 때 가장자리 여백 (px) */
const BOUNDS_PADDING = 48;

/** 표시 모양: role(역할색 채움) · outline(흰 바탕 + 역할색 테두리) · plain(흰 바탕 + 검은 테두리) */
export type KakaoMapMarkerTone = 'role' | 'outline' | 'plain';

export interface KakaoMapMarker {
  id: string | number;
  position: LatLngLiteral;
  /** 동그라미 안 글자 (순번·'가게' 등) */
  label: string;
  tone: KakaoMapMarkerTone;
  /** 크게 그린다 (선택된 표시) */
  emphasized?: boolean;
  /** 표시를 누르면 호출된다 */
  onClick?: () => void;
}

export interface KakaoMapProps {
  markers: KakaoMapMarker[];
  /** 스크린리더용 지도 설명 */
  label: string;
  /** 높이 등 지도 영역 클래스 */
  className?: string;
}

type MapStatus = 'loading' | 'ready' | 'error';

const MARKER_TONE_CLASS: Record<KakaoMapMarkerTone, string> = {
  role: 'border-surface bg-role text-role-on',
  outline: 'border-role bg-surface text-role',
  plain: 'border-fg bg-surface text-fg',
};

/**
 * 표시 하나의 DOM 요소를 만든다. 글자는 textContent 로 넣는다.
 * @param marker - 표시 정보
 * @returns 동그라미 요소
 */
const createMarkerElement = (marker: KakaoMapMarker): HTMLElement => {
  const element = document.createElement(marker.onClick ? 'button' : 'span');
  element.textContent = marker.label;
  element.className = cn(
    'flex items-center justify-center rounded-full border-[2.5px] font-bold whitespace-nowrap shadow-[0_1px_4px_rgb(0_0_0/0.25)]',
    marker.label.length > 1 ? 'h-8.5 px-2.5 text-[12px]' : 'size-7 text-[12px]',
    marker.emphasized && 'scale-115',
    MARKER_TONE_CLASS[marker.tone],
  );
  if (marker.onClick) {
    element.setAttribute('type', 'button');
    element.setAttribute('aria-label', `${marker.label} 선택`);
    element.addEventListener('click', marker.onClick);
  }
  return element;
};

/**
 * 표시들이 모두 보이게 지도를 맞춘다. 하나뿐이면 그 자리를 가운데로 확대한다.
 * @param maps - kakao.maps
 * @param map - 지도
 * @param markers - 표시 목록
 */
const fitMarkers = (maps: typeof kakao.maps, map: kakao.maps.Map, markers: KakaoMapMarker[]): void => {
  if (markers.length === 0) return;
  if (markers.length === 1) {
    const [only] = markers;
    if (!only) return;
    map.setLevel(SINGLE_MARKER_LEVEL);
    map.setCenter(new maps.LatLng(only.position.lat, only.position.lng));
    return;
  }
  const bounds = new maps.LatLngBounds();
  markers.forEach(({ position }) => bounds.extend(new maps.LatLng(position.lat, position.lng)));
  map.setBounds(bounds, BOUNDS_PADDING, BOUNDS_PADDING, BOUNDS_PADDING, BOUNDS_PADDING);
};

/**
 * 카카오맵. SDK 를 불러와 지도를 그리고, 표시(markers)가 바뀌면 다시 그려 모두 보이게 맞춘다.
 * 영역 크기가 바뀌면 지도를 다시 맞춘다. SDK 를 못 불러오면 안내 문구를 보여 준다.
 * @param props markers(표시 목록), label, className
 * @returns 지도 요소
 */
export function KakaoMap({ markers, label, className }: KakaoMapProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ maps: typeof kakao.maps; map: kakao.maps.Map } | null>(null);
  const [status, setStatus] = useState<MapStatus>('loading');

  // 지도 만들기 (한 번)
  useEffect(() => {
    let isMounted = true;
    loadKakaoMap()
      .then((maps) => {
        const container = containerRef.current;
        if (!isMounted || !container) return;
        const map = new maps.Map(container, {
          center: new maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          level: DEFAULT_LEVEL,
        });
        mapRef.current = { maps, map };
        setStatus('ready');
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // 표시 그리기 + 화면 맞추기
  useEffect(() => {
    const current = mapRef.current;
    const container = containerRef.current;
    if (status !== 'ready' || !current || !container) return;
    const { maps, map } = current;

    const overlays = markers.map(
      (marker) =>
        new maps.CustomOverlay({
          position: new maps.LatLng(marker.position.lat, marker.position.lng),
          content: createMarkerElement(marker),
          map,
          zIndex: marker.emphasized ? 2 : 1,
          clickable: Boolean(marker.onClick),
        }),
    );
    fitMarkers(maps, map, markers);

    const observer = new ResizeObserver(() => {
      map.relayout();
      fitMarkers(maps, map, markers);
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      overlays.forEach((overlay) => overlay.setMap(null));
    };
  }, [markers, status]);

  return (
    <div className={cn('relative w-full bg-track', className)}>
      <div
        ref={containerRef}
        role='img'
        aria-label={label}
        className='size-full'
      />
      {status === 'loading' ? (
        <p className='absolute inset-0 flex items-center justify-center text-note text-fg-muted'>
          지도를 불러오고 있어요.
        </p>
      ) : null}
      {status === 'error' ? (
        <p className='absolute inset-0 flex items-center justify-center px-4 text-center text-note text-fg-muted'>
          지도를 불러오지 못했어요.
        </p>
      ) : null}
    </div>
  );
}
