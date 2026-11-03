import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon, type IconName } from '@/shared/ui/icon';

/** 안내 상자 톤: warn 주황(오류·주의, 느낌표 아이콘) · muted 회색(일반 안내) · role 옅은 역할색(강조 안내) */
const noticeVariants = cva('flex items-start gap-2 rounded-control px-3 py-2.5 text-note leading-[1.45]', {
  variants: {
    tone: {
      warn: 'bg-warn-soft text-warn',
      muted: 'bg-surface-hover text-fg-muted',
      role: 'bg-role-soft text-role-ink',
    },
  },
  defaultVariants: { tone: 'muted' },
});

type NoticeTone = NonNullable<VariantProps<typeof noticeVariants>['tone']>;

const DEFAULT_ICON: Record<NoticeTone, IconName | null> = { warn: 'alert', muted: null, role: 'info' };

export interface NoticeProps extends ComponentProps<'div'>, VariantProps<typeof noticeVariants> {
  /** 앞 아이콘. 생략하면 톤 기본값, null이면 숨김 */
  icon?: IconName | null;
}

/**
 * 짧은 안내 상자 (영업시간 아님·수락 안내·저장 오류 등).
 * @param props tone, icon과 div 속성 (오류를 바로 알려야 하면 role='alert'를 준다)
 * @returns 안내 요소
 */
export function Notice({ tone, icon, className, children, ...props }: NoticeProps): ReactNode {
  const iconName = icon === undefined ? DEFAULT_ICON[tone ?? 'muted'] : icon;

  return (
    <div
      className={cn(noticeVariants({ tone }), className)}
      {...props}
    >
      {iconName ? (
        <Icon
          name={iconName}
          size={16}
          className='mt-px shrink-0'
        />
      ) : null}
      <div className='min-w-0 flex-1'>{children}</div>
    </div>
  );
}
