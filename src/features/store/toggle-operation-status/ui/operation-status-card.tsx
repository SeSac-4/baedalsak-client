import type { ReactNode } from 'react';

import type { StoreDetail } from '@/entities/store';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

import { useToggleOperationStatus } from '../model/use-toggle-operation-status';

export interface OperationStatusCardProps {
  store: Pick<StoreDetail, 'id' | 'operationStatus'>;
  /** true면 카드·안내 문구 없이 배지+전환 버튼 한 줄 (O-01 상단용) */
  compact?: boolean;
}

/**
 * 현재 운영 상태 배지와 전환 버튼을 렌더링한다. 버튼을 누르면 반대 상태로 바꾼다.
 * @param props store(가게 ID·운영 상태), compact(한 줄 표시 여부)
 * @returns 운영 상태 요소
 */
export function OperationStatusCard({ store, compact = false }: OperationStatusCardProps): ReactNode {
  const { mutate: toggleOperationStatus, isPending } = useToggleOperationStatus(store.id);
  const isOpen = store.operationStatus === 'OPEN';
  const badge = <Badge tone={isOpen ? 'ok' : 'warn'}>{isOpen ? '정상 운영' : '임시 중지'}</Badge>;
  const toggleButton = (
    <Button
      variant='secondary'
      size='sm'
      className={compact ? undefined : 'ml-auto'}
      disabled={isPending}
      onClick={() => toggleOperationStatus(isOpen ? 'PAUSED' : 'OPEN')}
    >
      {isOpen ? '임시 중지로 전환' : '정상 운영으로 전환'}
    </Button>
  );

  if (compact) {
    return (
      <div className='flex items-center gap-2'>
        {badge}
        {toggleButton}
      </div>
    );
  }

  return (
    <Card className='flex flex-col gap-3'>
      <div className='flex flex-wrap items-center gap-2'>
        <strong className='text-body text-fg'>운영 상태</strong>
        {badge}
        {toggleButton}
      </div>
      <p className='text-note text-fg-muted'>정상 운영이면서 영업시간 안일 때만 주문이 들어와요.</p>
    </Card>
  );
}
