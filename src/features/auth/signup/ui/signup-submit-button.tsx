import type { ReactNode } from 'react';

import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';

export interface SignupSubmitButtonProps {
  /** 가입 요청 중이면 버튼을 막고 스피너를 보인다 */
  isSubmitting: boolean;
}

/**
 * 가입 폼(C-03~C-05) 공용 '가입하기' 제출 버튼.
 * @param props isSubmitting(요청 중 여부)
 * @returns 제출 버튼 요소
 */
export function SignupSubmitButton({ isSubmitting }: SignupSubmitButtonProps): ReactNode {
  return (
    <Button
      type='submit'
      size='lg'
      block
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <Spinner
          size={14}
          label='가입 중'
          className='border-current border-t-transparent'
        />
      ) : null}
      가입하기
    </Button>
  );
}
