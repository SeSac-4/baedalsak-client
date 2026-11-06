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
const PATH_WEIGHT = 5;
const PATH_OPACITY = 0.85;
/** 역할색 토큰을 못 읽을 때 경로선 색 */
const PATH_FALLBACK_COLOR = '#cc3a1e';

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

/** 경로선 모양: solid(도로 경로) · dashed(길찾기 실패로 직선) */
export type KakaoMapPathStyle = 'solid' | 'dashed';

export interface KakaoMapProps {
  markers: KakaoMapMarker[];
  /** 경로선 좌표 (두 점 이상이면 그린다). 화면 맞추기에도 포함된다 */
  path?: LatLngLiteral[];
  /** 경로선 모양 (기본 solid) */
  pathStyle?: KakaoMapPathStyle;
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
 * 표시·경로선이 모두 보이게 지도를 맞춘다. 점이 하나뿐이면 그 자리를 가운데로 확대한다.
 * @param maps - kakao.maps
 * @param map - 지도
 * @param points - 표시·경로선 좌표
 */
const fitPoints = (maps: typeof kakao.maps, map: kakao.maps.Map, points: LatLngLiteral[]): void => {
  if (points.length === 0) return;
  if (points.length === 1) {
    const [only] = points;
    if (!only) return;
    map.setLevel(SINGLE_MARKER_LEVEL);
    map.setCenter(new maps.LatLng(only.lat, only.lng));
    return;
  }
  const bounds = new maps.LatLngBounds();
  points.forEach(({ lat, lng }) => bounds.extend(new maps.LatLng(lat, lng)));
  map.setBounds(bounds, BOUNDS_PADDING, BOUNDS_PADDING, BOUNDS_PADDING, BOUNDS_PADDING);
};

/**
 * 경로선 색을 역할색 토큰(--color-role)에서 읽는다. 카카오 Polyline 은 CSS 변수를 못 읽어 실제 값이 필요하다.
 * @param element - 토큰이 적용된 요소
 * @returns CSS 색 문자열
 */
const getPathColor = (element: HTMLElement): string =>
  getComputedStyle(element).getPropertyValue('--color-role').trim() || PATH_FALLBACK_COLOR;

/**
 * 화면 맞추기를 다시 할지 정하는 키. 라이더 표시가 움직일 때마다 지도가 다시 맞춰지지 않도록
 * 좌표가 아니라 표시 종류와 경로선만 본다.
 * @param markers - 표시 목록
 * @param path - 경로선 좌표
 * @returns 키 문자열
 */
const getFitKey = (markers: KakaoMapMarker[], path: LatLngLiteral[] | undefined): string => {
  const ids = markers.map(({ id }) => id).join(',');
  const first = path?.[0];
  return `${ids}|${path?.length ?? 0}|${first ? `${first.lat},${first.lng}` : ''}`;
};

/**
 * 카카오맵. SDK 를 불러와 지도를 그리고, 표시(markers)·경로선(path)이 바뀌면 다시 그린다.
 * 화면 맞추기는 표시 종류나 경로선이 바뀔 때와 영역 크기가 바뀔 때만 한다 (라이더가 움직여도 지도는 그대로).
 * SDK 를 못 불러오면 안내 문구를 보여 준다.
 * @param props markers(표시 목록), path(경로선), pathStyle, label, className
 * @returns 지도 요소
 */
export function KakaoMap({ markers, path, pathStyle = 'solid', label, className }: KakaoMapProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ maps: typeof kakao.maps; map: kakao.maps.Map } | null>(null);
  /** 화면 맞추기에 쓸 최신 좌표 (ResizeObserver 콜백이 읽는다) */
  const fitPointsRef = useRef<LatLngLiteral[]>([]);
  const [status, setStatus] = useState<MapStatus>('loading');
  const fitKey = getFitKey(markers, path);

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

  // 표시 그리기
  useEffect(() => {
    const current = mapRef.current;
    if (status !== 'ready' || !current) return;
    const { maps, map } = current;
    fitPointsRef.current = [...markers.map(({ position }) => position), ...(path ?? [])];

    const overlays = markers.map(
      (marker) =>
        new maps.CustomOverlay({
          position: new maps.LatLng(marker.position.lat, marker.position.lng),
          content: createMarkerElement(marker),
          map,
          zIndex: marker.emphasized ? 3 : 2,
          clickable: Boolean(marker.onClick),
        }),
    );
    return () => overlays.forEach((overlay) => overlay.setMap(null));
  }, [markers, path, status]);

  // 경로선 그리기 (표시 아래)
  useEffect(() => {
    const current = mapRef.current;
    const container = containerRef.current;
    if (status !== 'ready' || !current || !container || !path || path.length < 2) return;
    const { maps, map } = current;

    const polyline = new maps.Polyline({
      path: path.map(({ lat, lng }) => new maps.LatLng(lat, lng)),
      map,
      strokeWeight: PATH_WEIGHT,
      strokeColor: getPathColor(container),
      strokeOpacity: PATH_OPACITY,
      strokeStyle: pathStyle === 'dashed' ? 'shortdash' : 'solid',
      zIndex: 1,
    });
    return () => polyline.setMap(null);
  }, [path, pathStyle, status]);

  // 화면 맞추기: 표시 종류·경로선이 바뀔 때와 영역 크기가 바뀔 때
  useEffect(() => {
    const current = mapRef.current;
    const container = containerRef.current;
    if (status !== 'ready' || !current || !container) return;
    const { maps, map } = current;

    fitPoints(maps, map, fitPointsRef.current);
    const observer = new ResizeObserver(() => {
      map.relayout();
      fitPoints(maps, map, fitPointsRef.current);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [fitKey, status]);

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
