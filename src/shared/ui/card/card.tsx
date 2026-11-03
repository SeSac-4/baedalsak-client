import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

/**
 * 카드 스타일. padding: md 20px(기본) · sm 16×20px(목록 카드) · none(사진이 꽉 차는 카드).
 * interactive: 누를 수 있는 카드의 hover · highlighted: 진행 중 등 강조(역할색 2px 테두리).
 */
const cardVariants = cva('rounded-card border border-border bg-surface', {
  variants: {
    padding: {
      md: 'p-5',
      sm: 'px-5 py-4',
      none: 'overflow-hidden',
    },
    interactive: {
      true: 'transition hover:border-border-strong hover:bg-surface-hover',
      false: '',
    },
    highlighted: {
      true: 'border-role ring-1 ring-role',
      false: '',
    },
  },
  defaultVariants: { padding: 'md', interactive: false, highlighted: false },
});

export interface CardProps extends ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

/**
 * 정보 묶음 카드를 렌더링한다.
 * @param props padding·interactive·highlighted와 div 속성
 * @returns 카드 요소
 */
export function Card({ className, padding, interactive, highlighted, ...props }: CardProps): ReactNode {
  return (
    <div
      className={cn(cardVariants({ padding, interactive, highlighted }), className)}
      {...props}
    />
  );
}
