import { useState, type ComponentProps, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';
import { FIELD_CLASS } from '@/shared/ui/input';

export type PasswordInputProps = Omit<ComponentProps<'input'>, 'type'>;

/**
 * 비밀번호 입력칸. 오른쪽 눈 버튼으로 글자를 보이거나 숨긴다.
 * @param props input 속성 (ref 포함, id가 있으면 눈 버튼이 aria-controls로 가리킨다)
 * @returns 비밀번호 입력 요소
 */
export function PasswordInput({ className, id, ...props }: PasswordInputProps): ReactNode {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  return (
    <div className='relative w-full'>
      <input
        id={id}
        type={isRevealed ? 'text' : 'password'}
        className={cn(FIELD_CLASS, 'pr-12', className)}
        {...props}
      />
      <button
        type='button'
        aria-label={isRevealed ? '비밀번호 숨기기' : '비밀번호 보기'}
        aria-controls={id}
        aria-pressed={isRevealed}
        onClick={() => setIsRevealed((prev) => !prev)}
        className={cn(
          'absolute top-px right-px flex size-11 items-center justify-center rounded-control transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink',
          isRevealed ? 'text-role-ink' : 'text-fg-muted hover:text-fg',
        )}
      >
        <Icon
          name={isRevealed ? 'eye-off' : 'eye'}
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
}
