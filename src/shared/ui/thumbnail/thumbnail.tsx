import { useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

/**
 * 사진 표시 — 크기·비율은 className으로 정하고, 사진이 없거나(src=null) 불러오지 못하면 기본 그림을 보여 준다.
 * 사진은 CloudFront로만 보여서 AWS가 꺼진 시간에는 기본 그림으로 바뀐다.
 */
export interface ThumbnailProps {
  /** 사진 주소 (없으면 null) */
  src: string | null | undefined;
  /** 대체 텍스트 (예: 메뉴명) */
  alt: string;
  className?: string;
}

/**
 * 사진 또는 기본 그림을 렌더링한다. 화면 밖 사진은 늦게 불러온다(loading=lazy).
 * @param props src(사진 주소), alt(대체 텍스트), className(크기·비율)
 * @returns 사진 요소
 */
export function Thumbnail({ src, alt, className }: ThumbnailProps): ReactNode {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isVisible = Boolean(src) && failedSrc !== src;

  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-muted-soft', className)}>
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
          className='flex size-full items-center justify-center text-fg-subtle'
        >
          <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            className='size-1/3 max-h-10 max-w-10'
            aria-hidden
          >
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
              r='1.5'
            />
            <path d='m21 16-5-5-8 8' />
          </svg>
        </div>
      )}
    </div>
  );
}
