import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface ChoiceGroupProps extends Omit<ComponentProps<'div'>, 'role'> {
  /** 한 줄에 놓을 버튼 수 (기본 3) */
  columns?: number;
}

/**
 * ChoiceButton 묶음 (radiogroup). 이름은 aria-label이나 aria-labelledby로 붙인다.
 * @param props columns(열 수)와 div 속성
 * @returns 라디오 그룹 요소
 */
export function ChoiceGroup({ columns = 3, className, style, ...props }: ChoiceGroupProps): ReactNode {
  return (
    <div
      role='radiogroup'
      className={cn('grid gap-2', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, ...style }}
      {...props}
    />
  );
}
