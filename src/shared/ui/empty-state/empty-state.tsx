import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon, type IconName } from '@/shared/ui/icon';

export interface EmptyStateProps {
  /** 굵은 안내 문구 (예: '아직 주문한 적이 없어요') */
  message: ReactNode;
  /** 아래 보조 문구 */
  description?: ReactNode;
  icon?: IconName;
  /** 다음 행동 (버튼·링크) */
  action?: ReactNode;
  className?: string;
}

/**
 * 빈 목록·불러오기 실패 안내 카드. 아이콘 · 문구 · 보조 문구 · 다음 행동 순서로 가운데 정렬한다.
 * @param props message, description, icon, action, className
 * @returns 빈 상태 요소
 */
export function EmptyState({ message, description, icon, action, className }: EmptyStateProps): ReactNode {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-card border border-border bg-surface px-5 py-10 text-center',
        className,
      )}
    >
      {icon ? (
        <Icon
          name={icon}
          size={32}
          strokeWidth={1.8}
          className='mb-1.5 text-fg-muted'
        />
      ) : null}
      <p className='font-bold text-fg'>{message}</p>
      {description ? <p className='text-note text-fg-muted'>{description}</p> : null}
      {action ? <div className='mt-2.5'>{action}</div> : null}
    </div>
  );
}
