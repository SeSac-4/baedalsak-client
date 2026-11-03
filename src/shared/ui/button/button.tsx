import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import { buttonVariants, type ButtonVariantProps } from './button-variants';

export interface ButtonProps extends ComponentProps<'button'>, ButtonVariantProps {}

/**
 * 버튼을 렌더링한다. type 기본값은 'button' (폼 제출은 type='submit'을 직접 준다).
 * @param props variant·size·block과 button 속성 (ref 포함)
 * @returns 버튼 요소
 */
export function Button({ className, variant, size, block, type = 'button', ...props }: ButtonProps): ReactNode {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  );
}
