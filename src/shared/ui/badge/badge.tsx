import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/cn';

/**
 * CMP-05 StatusBadge (pill) — 상태 톤만 받는다. 상태→톤 매핑은 화면/엔티티가 하고,
 * 배지는 색을 덮어쓰지 않는다. (주문·배달·가게·메뉴 매핑은 docs/components.md)
 */
const badge = cva(
  'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-note font-medium',
  {
    variants: {
      tone: {
        ok: 'bg-ok-soft text-ok',
        warn: 'bg-warn-soft text-warn',
        info: 'bg-info-soft text-info',
        muted: 'bg-muted-soft text-muted',
      },
    },
    defaultVariants: { tone: 'muted' },
  },
);

export type BadgeTone = NonNullable<VariantProps<typeof badge>['tone']>;
export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badge>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...props} />;
}
