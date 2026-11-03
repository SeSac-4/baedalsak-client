import type { ReactNode } from 'react';

import type { StoreDetail } from '@/entities/store';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Switch } from '@/shared/ui/switch';

import { useToggleOperationStatus } from '../model/use-toggle-operation-status';

export interface OperationStatusCardProps {
  store: Pick<StoreDetail, 'id' | 'operationStatus'>;
  className?: string;
}

/**
 * 운영 상태 카드 (O-01 · O-04). 상태 배지·안내 문구와 스위치를 두고, 스위치를 누르면 바로 반대 상태로 바꾼다.
 * @param props store(가게 ID·운영 상태), className
 * @returns 운영 상태 카드 요소
 */
export function OperationStatusCard({ store, className }: OperationStatusCardProps): ReactNode {
  const { mutate: toggleOperationStatus, isPending } = useToggleOperationStatus(store.id);
  const isOpen = store.operationStatus === 'OPEN';

  return (
    <Card
      padding='sm'
      className={className}
    >
      <div className='flex items-center gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <strong className='text-fg'>운영 상태</strong>
            <Badge tone={isOpen ? 'ok' : 'warn'}>{isOpen ? '정상 운영' : '임시 중지'}</Badge>
          </div>
          <p className='text-note text-fg-muted'>
            {isOpen ? '영업시간 안이면 주문을 받아요' : '고객이 주문할 수 없어요'}
          </p>
        </div>
        <Switch
          checked={isOpen}
          disabled={isPending}
          label='정상 운영'
          onCheckedChange={(checked) => toggleOperationStatus(checked ? 'OPEN' : 'PAUSED')}
        />
      </div>
    </Card>
  );
}
