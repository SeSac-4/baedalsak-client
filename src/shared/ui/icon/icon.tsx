import type { ComponentProps, ReactNode } from 'react';

/** 디자인 시안의 선 아이콘 (24×24, stroke). 새 아이콘은 여기에 추가한다. */
const ICON_PATHS = {
  close: <path d='M6 6l12 12M18 6L6 18' />,
  grid: <path d='M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' />,
  'rice-bowl': <path d='M3 12h18a9 9 0 0 1-18 0zM8 8c0-1 1-1.5 1-2.5M12 8c0-1 1-1.5 1-2.5M16 8c0-1 1-1.5 1-2.5' />,
  skewer: <path d='M4 20L20 4M7 11l3-3 3 3-3 3zM11 7l3-3 3 3-3 3z' />,
  chicken: <path d='M14 4a6 6 0 0 1 6 6c0 4-4 6-7 5l-3 3a2 2 0 1 1-3-3l3-3c-1-3 1-8 4-8z' />,
  noodle: <path d='M3 11h18a9 9 0 0 1-18 0zM14 3l-2 8M19 4l-4 7' />,
  pizza: <path d='M4 6c5-3 11-3 16 0L12 21zM9 10h.01M14 12h.01M12 15h.01' />,
  cafe: <path d='M5 9h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 11h2a2 2 0 0 1 0 4h-2M9 3v3M12 3v3' />,
  refresh: (
    <>
      <path d='M20 11A8 8 0 1 0 18 17' />
      <path d='M20 5v6h-6' />
    </>
  ),
  check: <path d='M5 12.5l4.5 4.5L19 7.5' />,
  alert: (
    <>
      <circle
        cx='12'
        cy='12'
        r='9'
      />
      <path d='M12 7.5v5.5M12 16.5v.01' />
    </>
  ),
  info: (
    <>
      <circle
        cx='12'
        cy='12'
        r='9'
      />
      <path d='M12 11v5.5M12 7.5v.01' />
    </>
  ),
  image: (
    <>
      <rect
        x='3'
        y='5'
        width='18'
        height='14'
        rx='2'
      />
      <circle
        cx='9'
        cy='10'
        r='1.8'
      />
      <path d='M21 16l-5-5-8 8' />
    </>
  ),
  eye: (
    <>
      <path d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z' />
      <circle
        cx='12'
        cy='12'
        r='3'
      />
    </>
  ),
  'eye-off': (
    <>
      <path d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z' />
      <circle
        cx='12'
        cy='12'
        r='3'
      />
      <path d='M4 4l16 16' />
    </>
  ),
  plus: <path d='M12 5v14M5 12h14' />,
  minus: <path d='M6 12h12' />,
  'chevron-left': <path d='M15 6l-6 6 6 6' />,
  'chevron-right': <path d='M9 6l6 6-6 6' />,
  'chevron-down': <path d='M6 9l6 6 6-6' />,
  location: (
    <>
      <path d='M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z' />
      <circle
        cx='12'
        cy='9.5'
        r='2.5'
      />
    </>
  ),
  bag: (
    <>
      <path d='M5 8h14l-1 13H6z' />
      <path d='M9 8V6a3 3 0 0 1 6 0v2' />
    </>
  ),
  clock: (
    <>
      <circle
        cx='12'
        cy='12'
        r='9'
      />
      <path d='M12 7v5l3 2' />
    </>
  ),
  receipt: (
    <>
      <rect
        x='5'
        y='3'
        width='14'
        height='18'
        rx='2'
      />
      <path d='M9 8h6M9 12h6M9 16h3' />
    </>
  ),
  camera: (
    <>
      <path d='M4 8h3l2-3h6l2 3h3v11H4z' />
      <circle
        cx='12'
        cy='13'
        r='3.5'
      />
    </>
  ),
  external: (
    <>
      <path d='M14 5h5v5' />
      <path d='M19 5l-8 8' />
      <path d='M18 14v5H5V6h5' />
    </>
  ),
  store: (
    <>
      <path d='M4 9l1.5-5h13L20 9' />
      <path d='M4 9h16v1.5a2.7 2.7 0 0 1-5.3 0 2.7 2.7 0 0 1-5.4 0A2.7 2.7 0 0 1 4 10.5V9z' />
      <path d='M5 13v7h14v-7M10 20v-4h4v4' />
    </>
  ),
  walk: (
    <>
      <circle
        cx='13'
        cy='4'
        r='2'
      />
      <path d='M9 21l2.5-6.5L14 17v4M9.5 10.5L12 8l2.5 2 2.5 2M12 8l-.5 6.5' />
    </>
  ),
  bicycle: (
    <>
      <circle
        cx='6'
        cy='16'
        r='3.5'
      />
      <circle
        cx='18'
        cy='16'
        r='3.5'
      />
      <path d='M6 16l3.5-7h5L18 16M9.5 9L12 16H6M13 6h2.5' />
    </>
  ),
  motorcycle: (
    <>
      <circle
        cx='5.5'
        cy='16'
        r='3'
      />
      <circle
        cx='18.5'
        cy='16'
        r='3'
      />
      <path d='M5.5 16h6l3-6h-4M14.5 10l4 6M15.5 7H19' />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICON_PATHS;

export interface IconProps extends Omit<ComponentProps<'svg'>, 'children'> {
  name: IconName;
  /** 가로·세로 px (기본 20) */
  size?: number;
}

/**
 * 선 아이콘을 렌더링한다. 색은 글자색(currentColor)을 따르고, 장식용이라 스크린리더에서 숨긴다.
 * @param props name(아이콘 이름), size, strokeWidth 등 svg 속성
 * @returns svg 요소
 */
export function Icon({ name, size = 20, strokeWidth = 2, ...props }: IconProps): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={strokeWidth}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden
      focusable='false'
      {...props}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
