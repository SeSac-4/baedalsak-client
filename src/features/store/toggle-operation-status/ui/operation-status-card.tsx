import type { ReactNode } from 'react';

import type { OperationStatus } from '@/entities/store';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

export interface OperationStatusCardProps {
  status: OperationStatus;
}

/**
 * 현재 운영 상태 배지와 전환 버튼을 렌더링한다. (전환 동작은 API 연동 시 구현)
 * @param props status(현재 운영 상태)
 * @returns 운영 상태 카드 요소
 */
export function OperationStatusCard({ status }: OperationStatusCardProps): ReactNode {
  const isOpen = status === 'OPEN';

  return (
    <Card className='flex flex-col gap-3'>
      <div className='flex flex-wrap items-center gap-2'>
        <strong className='text-body text-fg'>운영 상태</strong>
        <Badge tone={isOpen ? 'ok' : 'warn'}>{isOpen ? '정상 운영' : '임시 중지'}</Badge>
        <Button
          variant='secondary'
          size='sm'
          className='ml-auto'
        >
          {isOpen ? '임시 중지로 전환' : '정상 운영으로 전환'}
        </Button>
      </div>
      <p className='text-note text-fg-muted'>정상 운영이면서 영업시간 안일 때만 주문이 들어와요.</p>
    </Card>
  );
}
