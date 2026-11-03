import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

export interface FormFieldProps {
  label: ReactNode;
  /** 입력칸 id. 라벨이 이 입력칸을 가리키고, 안내·오류 문구 id는 `${id}-message` */
  id: string;
  /** 회색 안내 문구 (오류가 있으면 오류 문구로 바뀐다) */
  hint?: ReactNode;
  /** 주황 오류 문구 */
  error?: ReactNode;
  /** 라디오 묶음처럼 label로 가리킬 수 없는 입력이면 true (라벨을 span으로, id는 `${id}-label`) */
  isGroup?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * 입력 항목 한 칸: 라벨(굵게) · 입력 · 안내 또는 오류 문구. 입력칸에는 aria-describedby={`${id}-message`}를 붙인다.
 * @param props label, id, hint, error, isGroup, children(입력), className
 * @returns 입력 항목 요소
 */
export function FormField({ label, id, hint, error, isGroup = false, children, className }: FormFieldProps): ReactNode {
  const message = error ?? hint;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {isGroup ? (
        <span
          id={`${id}-label`}
          className='font-semibold text-fg'
        >
          {label}
        </span>
      ) : (
        <label
          htmlFor={id}
          className='font-semibold text-fg'
        >
          {label}
        </label>
      )}
      {children}
      {message ? (
        <p
          id={`${id}-message`}
          className={cn('text-note leading-[1.45]', error ? 'text-warn' : 'text-fg-muted')}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
