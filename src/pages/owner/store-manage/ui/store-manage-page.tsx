import type { ReactNode } from 'react';

import { useMyStore } from '@/entities/store';
import { OperationStatusCard } from '@/features/store/toggle-operation-status';
import { StoreForm, useUpdateStore, type StoreFormValues } from '@/features/store/upsert-store';
import { getErrorCode, getErrorMessage } from '@/shared/api';
import { Card } from '@/shared/ui/card';
import { PageHeader } from '@/shared/ui/page-header';
import { useToast } from '@/shared/ui/toast';

import { BusinessHoursForm } from './business-hours-form';

const VALIDATION_FAILED = 'VALIDATION_FAILED';
const SAVED_MESSAGE = '가게 정보를 저장했어요.';

/**
 * O-04 가게 관리 화면. 운영 상태 전환, 가게 정보 수정, 요일별 영업시간 저장을 한다.
 * 내 가게는 사장님 라우트 가드가 먼저 불러 둔다.
 * @returns 가게 관리 페이지
 */
export function StoreManagePage(): ReactNode {
  const toast = useToast();
  const { data: store } = useMyStore();
  const { mutateAsync: updateStore } = useUpdateStore(store?.id ?? 0);

  if (!store) return null;

  /**
   * 가게 정보를 저장한다. 필드 검증 실패는 폼으로 넘기고, 그 밖의 에러는 토스트로 알린다.
   * @param values - 가게 정보
   */
  const handleStoreSubmit = async (values: StoreFormValues): Promise<void> => {
    try {
      await updateStore(values);
      toast(SAVED_MESSAGE);
    } catch (error: unknown) {
      if (getErrorCode(error) === VALIDATION_FAILED) throw error;
      toast(getErrorMessage(error));
    }
  };

  return (
    <div className='mx-auto flex max-w-[720px] flex-col gap-4 px-4 py-6'>
      <PageHeader title='가게 관리' />

      <OperationStatusCard store={store} />

      <Card className='flex flex-col gap-3'>
        <strong className='text-body text-fg'>가게 정보</strong>
        <StoreForm
          key={store.id}
          defaultValues={store}
          submitLabel='가게 정보 저장'
          onSubmit={handleStoreSubmit}
        />
      </Card>

      <Card className='flex flex-col gap-3'>
        <strong className='text-body text-fg'>요일별 영업시간</strong>
        <BusinessHoursForm
          key={store.id}
          storeId={store.id}
          hours={store.businessHours}
          today={store.todayHour.dayOfWeek}
        />
      </Card>
    </div>
  );
}
