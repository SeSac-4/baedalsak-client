import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

/**
 * 상태 배지 톤: ok 초록 · warn 주황 · info 파랑 · muted 회색 · role 역할색(개수 등).
 * 상태 → 톤 매핑은 엔티티·화면이 하고, 배지는 색을 덮어쓰지 않는다.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-note font-semibold whitespace-nowrap',
  {
    variants: {
      tone: {
        ok: 'bg-ok-soft text-ok',
        warn: 'bg-warn-soft text-warn',
        info: 'bg-info-soft text-info',
        muted: 'bg-muted-soft text-muted',
        role: 'bg-role-soft text-role-ink',
      },
    },
    defaultVariants: { tone: 'muted' },
  },
);

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>['tone']>;

export interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

/**
 * 상태 배지를 렌더링한다.
 * @param props tone(색 톤)과 span 속성
 * @returns 배지 요소
 */
export function Badge({ className, tone, ...props }: BadgeProps): ReactNode {
  return (
    <span
      className={cn(badgeVariants({ tone }), className)}
      {...props}
    />
  );
}
