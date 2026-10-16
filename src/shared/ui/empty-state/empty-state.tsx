import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

/** CMP-15 EmptyState — 점선 박스 + 안내 문구 + 다음 행동(옵션). */
export interface EmptyStateProps {
  message: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ message, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-10 text-center',
        className,
      )}
    >
      {icon ? <div className="text-fg-subtle">{icon}</div> : null}
      <p className="text-body text-fg-muted">{message}</p>
      {action}
    </div>
  );
}
