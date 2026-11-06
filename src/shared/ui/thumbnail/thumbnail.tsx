import { useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

/**
 * 사진 표시 — 크기·비율은 className으로 정하고, 사진이 없거나(src=null) 불러오지 못하면 대체 그림(fallbackSrc), 그것도 없으면 기본 그림을 보여 준다.
 * 대체 그림은 viewBox가 있는 SVG로 둔다. object-fill이면 칸 비율이 달라도 찌그러지거나 잘리지 않고 SVG 배경색이 남는 칸을 채운다.
 * 사진은 CloudFront로만 보여서 AWS가 꺼진 시간에는 기본 그림으로 바뀐다.
 */
export interface ThumbnailProps {
  /** 사진 주소 (없으면 null) */
  src: string | null | undefined;
  /** 사진이 없을 때 대신 보여 줄 그림 주소 */
  fallbackSrc?: string;
  /** 대체 텍스트 (예: 메뉴명) */
  alt: string;
  /** 기본 그림 아래 문구 (예: '메뉴 사진'). 작은 썸네일에서는 생략 */
  placeholderLabel?: string;
  className?: string;
}

/**
 * 사진 또는 기본 그림을 렌더링한다. 화면 밖 사진은 늦게 불러온다(loading=lazy).
 * @param props src(사진 주소), fallbackSrc(대체 그림), alt(대체 텍스트), placeholderLabel(기본 그림 문구), className(크기·비율)
 * @returns 사진 요소
 */
export function Thumbnail({ src, fallbackSrc, alt, placeholderLabel, className }: ThumbnailProps): ReactNode {
  const [failedSrcs, setFailedSrcs] = useState<string[]>([]);
  const shownSrc = [src, fallbackSrc].find((item) => item && !failedSrcs.includes(item));

  return (
    <div className={cn('relative overflow-hidden rounded-control bg-track', className)}>
      {shownSrc ? (
        <img
          src={shownSrc}
          alt={shownSrc === src ? alt : `${alt} (기본 그림)`}
          loading='lazy'
          decoding='async'
          onError={() => setFailedSrcs((prev) => [...prev, shownSrc])}
          className={cn('size-full', shownSrc === src ? 'object-cover' : 'object-fill')}
        />
      ) : (
        <div
          role='img'
          aria-label={`${alt} (사진 없음)`}
          className='flex size-full flex-col items-center justify-center gap-1 text-fg-muted'
        >
          <Icon
            name='image'
            strokeWidth={1.8}
            className='size-1/3 max-h-6 min-h-4 max-w-6 min-w-4'
          />
          {placeholderLabel ? <span className='text-note'>{placeholderLabel}</span> : null}
        </div>
      )}
    </div>
  );
}
