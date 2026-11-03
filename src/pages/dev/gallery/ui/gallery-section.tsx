import type { ReactNode } from 'react';

import { Card } from '@/shared/ui/card';

export interface GallerySectionProps {
  title: string;
  /** 컴포넌트 이름 (예: Button) */
  name: string;
  children: ReactNode;
}

/**
 * 갤러리 한 칸. 컴포넌트 이름과 설명 아래에 예시를 늘어놓는다.
 * @param props title(설명), name(컴포넌트 이름), children(예시)
 * @returns 갤러리 칸 요소
 */
export function GallerySection({ title, name, children }: GallerySectionProps): ReactNode {
  return (
    <Card className='flex flex-col gap-4'>
      <h2 className='font-bold text-fg'>
        {name} <span className='text-note font-normal text-fg-muted'>{title}</span>
      </h2>
      <div className='flex flex-wrap items-center gap-3'>{children}</div>
    </Card>
  );
}
