import type { ReactNode } from 'react';

import { STORE_DETAIL_MOCK } from '@/entities/store';
import { OperationStatusCard } from '@/features/store/toggle-operation-status';
import { StoreForm } from '@/features/store/upsert-store';
import { Card } from '@/shared/ui/card';
import { PageHeader } from '@/shared/ui/page-header';

import { BusinessHoursForm } from './business-hours-form';

/**
 * O-04 가게 관리 화면. 운영 상태, 가게 정보 수정, 요일별 영업시간 편집을 보여 준다. (목 데이터)
 * @returns 가게 관리 페이지
 */
export function StoreManagePage(): ReactNode {
  const store = STORE_DETAIL_MOCK;

  return (
    <div className='mx-auto flex max-w-[720px] flex-col gap-4 px-4 py-6'>
      <PageHeader title='가게 관리' />

      <OperationStatusCard status={store.operationStatus} />

      <Card className='flex flex-col gap-3'>
        <strong className='text-body text-fg'>가게 정보</strong>
        <StoreForm
          defaultValues={store}
          submitLabel='가게 정보 저장'
        />
      </Card>

      <Card className='flex flex-col gap-3'>
        <strong className='text-body text-fg'>요일별 영업시간</strong>
        <BusinessHoursForm
          defaultValues={store.businessHours}
          today={store.todayHour.dayOfWeek}
        />
      </Card>
    </div>
  );
}
