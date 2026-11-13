import { useState, type ReactNode } from 'react';
import { Navigate } from 'react-router';

import { DeliveryCard, useActiveDelivery, useRiderOnlineStore, useWaitingDeliveryList } from '@/entities/delivery';
import { getErrorMessage } from '@/shared/api';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { IconButton } from '@/shared/ui/icon-button';
import { Notice } from '@/shared/ui/notice';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

import { useAcceptDelivery } from '../model/use-accept-delivery';
import { PickupMap } from './pickup-map';

const ACTIVE_DELIVERY_PATH = '/rider/active';
const PAGE_CLASS =
  'mx-auto flex w-full flex-col gap-3 px-4 pt-4 pb-6 tablet:max-w-[760px] tablet:gap-3.5 tablet:px-6 tablet:pt-5 tablet:pb-10 desktop:max-w-[1180px] desktop:gap-4 desktop:px-10 desktop:pt-7 desktop:pb-12';

/**
 * R-01 배차 대기 목록 화면. 픽업 가게 지도와 배차 대기 배달을 오래된 순으로 보여 주고 수락한다.
 * 카드를 누르면 지도에서 그 요청을 강조한다. 쉬는 중이어도 목록은 보여 주고 수락만 막는다(운행 상태는 화면 상태로만 둔다).
 * 진행 중인 배달이 있으면 진행 중 배달 화면으로 보낸다. 상태 갱신은 새로고침 버튼으로만 한다.
 * @returns 배차 대기 목록 페이지
 */
export function WaitingListPage(): ReactNode {
  const { data: activeDelivery, isPending: isActivePending } = useActiveDelivery();
  const { data, error, isPending, isFetching, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useWaitingDeliveryList();
  const { mutate: accept, isPending: isAccepting, variables: acceptingId } = useAcceptDelivery();
  const isOnline = useRiderOnlineStore((state) => state.isOnline);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
    <div className={PAGE_CLASS}>
      <PageHeader
        title='배차 대기'
        badge={totalCount !== undefined ? <Badge tone='role'>{totalCount}건</Badge> : null}
        actions={
          <IconButton
            icon='refresh'
            label='새로고침'
            disabled={isFetching}
            onClick={() => void refetch()}
          />
        }
      />

      {isOnline ? null : <Notice>운행을 쉬는 중이에요. 목록은 볼 수 있고, 운행을 켜면 수락할 수 있어요.</Notice>}

      {isLoading ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='배차 대기 목록 불러오는 중' />
          배차 대기 목록을 불러오고 있어요.
        </div>
      ) : null}

      {!isLoading && error ? <EmptyState message={getErrorMessage(error)} /> : null}

      {!isLoading && deliveries && deliveries.length > 0 ? (
        // PC: 지도 | 목록 2열. 휠로 목록을 내려도 지도는 헤더 아래에 고정된다
        <div className='flex flex-col gap-3 tablet:gap-3.5 desktop:grid desktop:grid-cols-2 desktop:items-start desktop:gap-6'>
          <div className='desktop:sticky desktop:top-30'>
            <PickupMap
              deliveries={deliveries}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
          </div>
          <div className='flex flex-col gap-3 tablet:gap-3.5 desktop:gap-4'>
            <p className='text-note text-fg-muted'>
              오래된 요청부터 보여요. 수락하면 상세 주소와 고객 연락처가 열려요.
            </p>
            <div className='flex flex-col gap-3 tablet:grid tablet:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] tablet:items-start tablet:gap-3.5 desktop:gap-4'>
              {deliveries.map((delivery, index) => (
                <DeliveryCard
                  key={delivery.deliveryId}
                  delivery={delivery}
                  order={index + 1}
                  selected={index === selectedIndex}
                  onSelect={() => setSelectedIndex(index)}
                  footer={
                    <Button
                      block
                      size='lg'
                      variant={index === selectedIndex ? 'primary' : 'outline'}
                      disabled={!isOnline || isAccepting}
                      onClick={() => accept(delivery.deliveryId)}
                    >
                      {isAccepting && acceptingId === delivery.deliveryId ? '수락 중…' : '수락하기'}
                    </Button>
                  }
                />
              ))}
            </div>
            {hasNextPage ? (
              <Button
                variant='secondary'
                className='self-center'
                disabled={isFetchingNextPage}
                onClick={() => void fetchNextPage()}
              >
                더 보기
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {!isLoading && deliveries && deliveries.length === 0 ? (
        <EmptyState message='대기 중인 배달 요청이 없어요. 사장님이 주문을 수락하면 여기에 나타나요.' />
      ) : null}
    </div>
  );
}
