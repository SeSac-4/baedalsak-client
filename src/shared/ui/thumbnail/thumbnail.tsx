import { useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';

/**
 * 사진 표시 — 크기·비율은 className으로 정하고, 사진이 없거나(src=null) 불러오지 못하면 기본 그림을 보여 준다.
 * 사진은 CloudFront로만 보여서 AWS가 꺼진 시간에는 기본 그림으로 바뀐다.
 */
export interface ThumbnailProps {
  /** 사진 주소 (없으면 null) */
  src: string | null | undefined;
  /** 대체 텍스트 (예: 메뉴명) */
  alt: string;
  /** 기본 그림 아래 문구 (예: '메뉴 사진'). 작은 썸네일에서는 생략 */
  placeholderLabel?: string;
  className?: string;
}

/**
 * 사진 또는 기본 그림을 렌더링한다. 화면 밖 사진은 늦게 불러온다(loading=lazy).
 * @param props src(사진 주소), alt(대체 텍스트), placeholderLabel(기본 그림 문구), className(크기·비율)
 * @returns 사진 요소
 */
export function Thumbnail({ src, alt, placeholderLabel, className }: ThumbnailProps): ReactNode {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isVisible = Boolean(src) && failedSrc !== src;

  return (
    <div className={cn('relative overflow-hidden rounded-control bg-track', className)}>
      {isVisible ? (
        <img
          src={src ?? undefined}
          alt={alt}
          loading='lazy'
          decoding='async'
          onError={() => setFailedSrc(src ?? null)}
          className='size-full object-cover'
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
