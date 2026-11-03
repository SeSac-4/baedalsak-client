import type { ReactNode } from 'react';

import { useMyStore } from '@/entities/store';
import { OperationStatusCard } from '@/features/store/toggle-operation-status';
import { parseStoreRequest, StoreForm, useUpdateStore, type StoreFormValues } from '@/features/store/upsert-store';
import { Notice } from '@/shared/ui/notice';
import { PageHeader } from '@/shared/ui/page-header';
import { useToast } from '@/shared/ui/toast';

import { BusinessHoursForm } from './business-hours-form';
import { StorePhotoCard } from './store-photo-card';

const SAVED_MESSAGE = '가게 정보를 저장했어요.';

/**
 * O-04 가게 관리 화면. 운영 상태, 가게 사진, 가게 정보, 요일별 영업시간을 카드마다 따로 저장한다.
 * 내 가게는 사장님 라우트 가드가 먼저 불러 둔다.
 * @returns 가게 관리 페이지
 */
export function StoreManagePage(): ReactNode {
  const toast = useToast();
  const { data: store } = useMyStore();
  const { mutateAsync: updateStore } = useUpdateStore(store?.id ?? 0);

  if (!store) return null;

  /**
   * 가게 정보를 저장한다 (사진은 저장된 키를 그대로 보낸다). 실패하면 폼이 에러를 보여 주도록 다시 던진다.
   * @param values - 가게 정보
   */
  const handleStoreSubmit = async (values: StoreFormValues): Promise<void> => {
    await updateStore(parseStoreRequest(store, values));
    toast(SAVED_MESSAGE, 'success');
  };

  return (
    <div className='mx-auto flex w-full max-w-[560px] flex-col gap-3 tablet:gap-3.5 desktop:mx-0 desktop:max-w-[640px] desktop:gap-4'>
      <PageHeader title='가게 관리' />

      {store.operationStatus === 'PAUSED' ? (
        <Notice tone='warn'>임시 중지 상태예요. 영업시간을 확인하고 운영을 시작하세요.</Notice>
      ) : null}

      <OperationStatusCard store={store} />

      <StorePhotoCard
        key={`photo-${store.id}`}
        store={store}
      />

      <StoreForm
        key={`info-${store.id}`}
        variant='edit'
        defaultValues={store}
        submitLabel='가게 정보 저장'
        onSubmit={handleStoreSubmit}
      />

      <BusinessHoursForm
        key={`hours-${store.id}`}
        storeId={store.id}
        hours={store.businessHours}
        today={store.todayHour.dayOfWeek}
      />
    </div>
  );
}
