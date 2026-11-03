import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface PageHeaderProps {
  title: ReactNode;
  /** 제목 옆 배지 (상태·개수) */
  badge?: ReactNode;
  /** 제목 아래 안내 문구 */
  description?: ReactNode;
  /** 오른쪽 동작 (새로고침·추가 등) */
  actions?: ReactNode;
  className?: string;
}

/**
 * 화면 제목 줄. 제목(22px) · 배지 · 오른쪽 동작, 아래에 안내 문구를 둔다.
 * @param props title, badge, description, actions, className
 * @returns 화면 제목 요소
 */
export function PageHeader({ title, badge, description, actions, className }: PageHeaderProps): ReactNode {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className='flex flex-wrap items-center gap-2'>
        <h1 className='text-title font-bold text-fg'>{title}</h1>
        {badge}
        {actions ? <div className='ml-auto flex items-center gap-2'>{actions}</div> : null}
      </div>
      {description ? <p className='text-note text-fg-muted'>{description}</p> : null}
    </div>
  );
}
