import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface ChoiceButtonProps extends Omit<ComponentProps<'button'>, 'role'> {
  selected: boolean;
}

/**
 * 여러 개 중 하나를 고르는 버튼 (카테고리·조리 시간·운송수단 등). ChoiceGroup 안에 둔다.
 * 고르면 옅은 역할색 배경과 역할색 테두리가 된다.
 * @param props selected(선택 여부)와 button 속성
 * @returns 라디오 버튼 요소
 */
export function ChoiceButton({ selected, className, type = 'button', ...props }: ChoiceButtonProps): ReactNode {
  return (
    <button
      type={type}
      role='radio'
      aria-checked={selected}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-1 rounded-control border px-3 text-body transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selected
          ? 'border-role bg-role-soft font-bold text-role-ink shadow-[inset_0_0_0_1px_var(--rc)]'
          : 'border-border bg-surface text-fg hover:bg-surface-hover',
        className,
      )}
      {...props}
    />
  );
}
