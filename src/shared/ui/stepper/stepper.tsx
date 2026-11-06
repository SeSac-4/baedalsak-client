import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface Step {
  label: string;
  time?: string;
}

export interface StepperProps {
  steps: Step[];
  /** 현재 단계 번호 (0부터). 앞 단계는 지난 단계, 뒤 단계는 아직 오지 않은 단계 */
  current: number;
  className?: string;
}

type StepState = 'done' | 'current' | 'upcoming';

/**
 * 단계 위치로 상태를 정한다.
 * @param index - 단계 번호
 * @param current - 현재 단계 번호
 * @returns 지난·현재·남은 단계
 */
const getStepState = (index: number, current: number): StepState => {
  if (index < current) return 'done';
  return index === current ? 'current' : 'upcoming';
};

/**
 * 진행 단계 표시 (주문 결제완료 → 배달완료 등). 번호 동그라미 · 이름 · 시각을 한 칸씩 같은 너비로 놓는다.
 * @param props steps(단계 목록), current(현재 단계), className
 * @returns 단계 목록 요소
 */
export function Stepper({ steps, current, className }: StepperProps): ReactNode {
  return (
    <ol
      className={cn('grid gap-1', className)}
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map((step, index) => {
        const state = getStepState(index, current);
        return (
          <li
            key={step.label}
            aria-current={state === 'current' ? 'step' : undefined}
            className='flex flex-col items-center gap-1 text-center'
          >
            <span
              className={cn(
                'flex size-6.5 items-center justify-center rounded-full text-note font-bold',
                state === 'upcoming' ? 'bg-surface-hover text-fg-muted' : 'bg-role text-role-on',
                state === 'current' && 'ring-4 ring-role-soft',
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                'text-note whitespace-nowrap',
                state === 'upcoming' ? 'text-fg-muted' : 'font-semibold text-fg',
              )}
            >
              {step.label}
            </span>
            {step.time ? <span className='text-note text-fg-muted tabular-nums'>{step.time}</span> : null}
          </li>
        );
      })}
    </ol>
  );
}
