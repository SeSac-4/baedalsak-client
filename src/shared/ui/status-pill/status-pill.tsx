import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon, type IconName } from '@/shared/ui/icon';

export type StatusPillDot = 'ok' | 'warn' | 'muted' | 'role';

const DOT_CLASS: Record<StatusPillDot, string> = {
  ok: 'bg-ok-dot',
  warn: 'bg-warn',
  muted: 'bg-fg-subtle',
  role: 'bg-role',
};

export interface StatusPillProps extends ComponentProps<'span'> {
  /** 앞 점 색 (운영 상태 등) */
  dot?: StatusPillDot;
  /** 앞 아이콘 (위치 등). dot과 함께 쓰지 않는다 */
  icon?: IconName;
}

/**
 * 테두리 있는 둥근 상태 표시 (헤더의 '● 성수 떡볶이 · 정상 운영', '위치 성수이로 77' 등).
 * @param props dot(점 색), icon(앞 아이콘)과 span 속성
 * @returns 상태 표시 요소
 */
export function StatusPill({ dot, icon, className, children, ...props }: StatusPillProps): ReactNode {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-note whitespace-nowrap text-fg-muted',
        className,
      )}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden
          className={cn('size-1.75 shrink-0 rounded-full', DOT_CLASS[dot])}
        />
      ) : null}
      {icon ? (
        <Icon
          name={icon}
          size={14}
          className='shrink-0'
        />
      ) : null}
      {children}
    </span>
  );
}
