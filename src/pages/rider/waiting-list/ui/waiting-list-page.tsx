import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import { DeliveryCard, useActiveDelivery, useWaitingDeliveryList } from '@/entities/delivery';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

import { useAcceptDelivery } from '../model/use-accept-delivery';

const ACTIVE_DELIVERY_PATH = '/rider/active';

/**
 * R-01 배차 대기 목록 화면. 배차 대기 배달을 오래된 순으로 보여 주고 수락한다.
 * 진행 중인 배달이 있으면 진행 중 배달 화면으로 보낸다. 상태 갱신은 새로고침 버튼으로만 한다.
 * @returns 배차 대기 목록 페이지
 */
export function WaitingListPage(): ReactNode {
  const { data: activeDelivery, isPending: isActivePending } = useActiveDelivery();
  const { data, error, isPending, isFetching, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useWaitingDeliveryList();
  const { mutate: accept, isPending: isAccepting, variables: acceptingId } = useAcceptDelivery();

  if (activeDelivery) {
    return (
      <Navigate
        to={ACTIVE_DELIVERY_PATH}
        replace
      />
    );
  }

  const deliveries = data?.pages.flatMap((page) => page.content);
  const totalCount = data?.pages[0]?.totalElements;
  const isLoading = isPending || isActivePending;

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col px-4 py-6'>
      <PageHeader
        title='배차 대기 목록'
        badge={
          totalCount !== undefined ? <span className='text-note text-fg-muted tabular-nums'>{totalCount}건</span> : null
        }
        actions={
          <Button
            variant='secondary'
            size='sm'
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            새로고침
          </Button>
        }
      />

      {isLoading ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='배차 대기 목록 불러오는 중' />
          배차 대기 목록을 불러오고 있어요.
        </div>
      ) : null}

      {!isLoading && error ? <EmptyState message={getErrorMessage(error)} /> : null}

      {!isLoading && deliveries && deliveries.length > 0 ? (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] items-start gap-3'>
          {deliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.deliveryId}
              delivery={delivery}
              footer={
                <Button
                  block
                  disabled={isAccepting}
                  onClick={() => accept(delivery.deliveryId)}
                >
                  {isAccepting && acceptingId === delivery.deliveryId ? '수락 중…' : '수락'}
                </Button>
              }
            />
          ))}
        </div>
      ) : null}

      {!isLoading && hasNextPage ? (
        <Button
          variant='secondary'
          className='mt-4 self-center'
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        >
          더 보기
        </Button>
      ) : null}

      {!isLoading && deliveries && deliveries.length === 0 ? (
        <EmptyState message='대기 중인 배달 요청이 없어요. 사장님이 주문을 수락하면 여기에 나타나요.' />
      ) : null}
    </div>
  );
}
