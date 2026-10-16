import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

/**
 * CMP-03 PageTitle — h2 + 상태 배지(옵션) + 우측 액션(새로고침 등).
 * 줄바꿈 허용. 전 화면에서 사용.
 */
export interface PageHeaderProps {
  title: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, badge, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-center gap-x-3 gap-y-2', className)}>
      <h2 className="text-title font-bold text-fg">{title}</h2>
      {badge}
      {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
