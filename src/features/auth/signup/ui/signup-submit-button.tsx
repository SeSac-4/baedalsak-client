import type { ReactNode } from 'react';

import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';

const BLOCKED_REASON_ID = 'signup-submit-blocked-reason';

export interface SignupSubmitButtonProps {
  /** 가입 요청 중이면 버튼을 막고 스피너를 보인다 */
  isSubmitting: boolean;
  /** 버튼을 막는 이유 (예: 이메일 인증 전). 있으면 버튼을 막고 버튼 위에 안내를 보인다 */
  blockedReason?: string | null;
}

/**
 * 가입 폼(C-03~C-05) 공용 '가입하기' 제출 버튼. 막는 이유가 있으면 버튼을 막고 그 이유를 버튼 위에 보여 준다.
 * @param props isSubmitting(요청 중 여부), blockedReason(막는 이유)
 * @returns 제출 버튼 요소
 */
export function SignupSubmitButton({ isSubmitting, blockedReason }: SignupSubmitButtonProps): ReactNode {
  return (
    <div className='flex flex-col gap-2'>
      {blockedReason ? (
        <p
          id={BLOCKED_REASON_ID}
          className='text-center text-note text-fg-muted'
        >
          {blockedReason}
        </p>
      ) : null}
      <Button
        type='submit'
        size='lg'
        block
        disabled={isSubmitting || Boolean(blockedReason)}
        aria-describedby={blockedReason ? BLOCKED_REASON_ID : undefined}
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
    </div>
  );
}
