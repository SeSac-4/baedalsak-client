import { cn } from '@/shared/lib/cn';

/**
 * CMP-06 StatusTimeline — 주문 5단계(결제대기→결제완료→조리중→배달중→배달완료).
 * current = 현재 단계 인덱스. 이전은 done, 이후는 미도달. ≤760px에서 단계 최소폭 90px로 줄바꿈.
 */
export interface Step {
  label: string;
  time?: string;
}

export interface StepperProps {
  steps: Step[];
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn('flex flex-wrap gap-x-2 gap-y-3', className)}>
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'upcoming';
        return (
          <li
            key={step.label}
            aria-current={state === 'current' ? 'step' : undefined}
            className='flex min-w-[90px] flex-1 flex-col items-center gap-1 text-center'
          >
            <span
              className={cn(
                'flex size-6 items-center justify-center rounded-full text-note font-semibold',
                state === 'done' && 'bg-role text-white',
                state === 'current' && 'bg-role text-white ring-2 ring-role/30',
                state === 'upcoming' && 'bg-muted-soft text-fg-subtle',
              )}
            >
              {i + 1}
            </span>
            <span className={cn('text-note font-medium', state === 'upcoming' ? 'text-fg-subtle' : 'text-fg')}>
              {step.label}
            </span>
            {step.time ? <span className='text-note text-fg-subtle tabular-nums'>{step.time}</span> : null}
          </li>
        );
      })}
    </ol>
  );
}
