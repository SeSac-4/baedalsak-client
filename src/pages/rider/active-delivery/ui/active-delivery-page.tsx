import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { DELIVERY_STATUS_LABEL, getReadyMinutesLeft, useActiveDelivery, type RiderDelivery } from '@/entities/delivery';
import { getErrorMessage } from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import { formatPrice, formatTime } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button, getButtonClassName } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { Icon, type IconName } from '@/shared/ui/icon';
import { IconButton } from '@/shared/ui/icon-button';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';
import { useToast } from '@/shared/ui/toast';
import { DeliveryMap } from '@/widgets/delivery-map';

import { useCompleteDelivery } from '../model/use-complete-delivery';
import { usePickupDelivery } from '../model/use-pickup-delivery';

const WAITING_LIST_PATH = '/rider';
const LINK_CLASS = 'text-note font-medium text-role-ink hover:underline';
const PAGE_CLASS =
  'mx-auto flex w-full flex-col gap-3 px-4 pt-4 pb-6 tablet:max-w-[760px] tablet:gap-3.5 tablet:px-6 tablet:pt-5 tablet:pb-10 desktop:max-w-[1180px] desktop:gap-4 desktop:px-10 desktop:pt-7 desktop:pb-12';

interface ActiveDeliveryCopy {
  headline: string;
  description: string;
  cta: string;
  hint: string;
}

/**
 * 전화번호를 tel: 링크 주소로 바꾼다. 숫자와 +만 남긴다.
 * @param phone 전화번호 (예: 010-1234-5678)
 * @returns tel: 링크 (예: tel:01012345678)
 */
const getTelHref = (phone: string): string => `tel:${phone.replace(/[^0-9+]/g, '')}`;

/**
 * 조리 완료 예상 시각 안내를 만든다. 남은 분이 있으면 함께 보여 준다.
 * @param estimatedReadyAt ISO 8601 조리 완료 예상 시각
 * @returns 예: 조리 완료 예상 12:30 · 3분 남음
 */
const getReadyDescription = (estimatedReadyAt: string): string => {
  const minutesLeft = getReadyMinutesLeft(estimatedReadyAt);
  const time = `조리 완료 예상 ${formatTime(estimatedReadyAt)}`;
  return minutesLeft > 0 ? `${time} · ${minutesLeft}분 남음` : time;
};

/**
 * 상태별 안내 문구와 버튼 이름을 구한다. 배차 완료면 가게로, 픽업 완료면 배달지로 안내한다.
 * @param delivery 진행 중 배달
 * @returns 제목·설명·버튼·버튼 안내 문구
 */
const getActiveDeliveryCopy = (delivery: RiderDelivery): ActiveDeliveryCopy =>
  delivery.status === 'PICKED_UP'
    ? {
        headline: '배달지로 이동하세요',
        description: '배달 주소와 요청사항을 확인해 주세요',
        cta: '배달 완료',
        hint: '배달지에 도착하면 눌러 주세요',
      }
    : {
        headline: '가게로 이동하세요',
        description: getReadyDescription(delivery.estimatedReadyAt),
        cta: '픽업 완료',
        hint: '음식을 받으면 눌러 주세요',
      };

/**
 * 경로 단계 앞 아이콘을 렌더링한다. 지금 가야 할 곳이면 역할색으로 채운다.
 * @param icon 아이콘 이름
 * @param isCurrent 지금 가야 할 곳인지
 * @returns 아이콘 요소
 */
const renderStepIcon = (icon: IconName, isCurrent: boolean): ReactNode => (
  <span
    aria-hidden
    className={cn(
      'flex size-8 flex-none items-center justify-center rounded-full',
      isCurrent ? 'bg-role text-role-on' : 'bg-muted-soft text-fg-muted',
    )}
  >
    <Icon
      name={icon}
      size={16}
    />
  </span>
);

/**
 * R-02 진행 중 배달 화면. 맡은 배달의 픽업지·배달지·요청사항·고객 연락처를 보여 주고,
 * 상태에 따라 픽업 완료 또는 배달 완료 버튼 하나만 보여 준다. 상태 갱신은 새로고침 버튼으로만 한다.
 * 지도(DeliveryMap)는 카카오맵에 가게·배달지를 표시한다. PC는 지도 | 배달 정보(340px) 2열.
 * @returns 진행 중 배달 페이지
 */
export function ActiveDeliveryPage(): ReactNode {
  const toast = useToast();
  const { data: delivery, error, isPending, isFetching, refetch } = useActiveDelivery();
  const { mutate: pickup, isPending: isPickingUp } = usePickupDelivery();
  const { mutate: complete, isPending: isCompleting } = useCompleteDelivery();
  const isSubmitting = isPickingUp || isCompleting;

  /**
   * 배달 주소를 클립보드에 복사한다.
   * @param address 배달 주소
   */
  const handleCopyAddressClick = async (address: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(address);
      toast('배달 주소를 복사했어요.');
    } catch {
      toast('주소를 복사하지 못했어요.');
    }
  };

  /**
   * 상태에 맞는 동작(픽업 완료·배달 완료)을 실행한다.
   * @param target 진행 중 배달
   */
  const handleActionClick = (target: RiderDelivery): void => {
    if (target.status === 'ASSIGNED') pickup(target.deliveryId);
    if (target.status === 'PICKED_UP') complete(target.deliveryId);
  };

  const copy = delivery ? getActiveDeliveryCopy(delivery) : null;
  const isPickedUp = delivery?.status === 'PICKED_UP';

  return (
    <div className={PAGE_CLASS}>
      <PageHeader
        title='진행 중 배달'
        badge={delivery ? <Badge tone='role'>{DELIVERY_STATUS_LABEL[delivery.status]}</Badge> : null}
        actions={
          <IconButton
            icon='refresh'
            label='새로고침'
            disabled={isFetching}
            onClick={() => void refetch()}
          />
        }
      />

      {isPending ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='진행 중 배달 불러오는 중' />
          진행 중 배달을 불러오고 있어요.
        </div>
      ) : null}

      {error ? <EmptyState message={getErrorMessage(error)} /> : null}

      {delivery === null ? (
        <EmptyState
          message='진행 중인 배달이 없어요.'
          action={
            <Link
              to={WAITING_LIST_PATH}
              className={LINK_CLASS}
            >
              배차 대기 목록으로
            </Link>
          }
        />
      ) : null}

      {delivery && copy ? (
        <>
          <div className='flex flex-col gap-3 tablet:gap-3.5 desktop:grid desktop:grid-cols-[minmax(0,1fr)_340px] desktop:items-start desktop:gap-6'>
            <DeliveryMap
              storeAddress={delivery.pickupAddress}
              deliveryAddress={delivery.deliveryAddress}
              status={delivery.status}
            />
            <div className='flex flex-col gap-3 tablet:gap-3.5 desktop:sticky desktop:top-30 desktop:gap-4'>
              <Card className='flex flex-col gap-4'>
                <div>
                  <h2 className='font-bold text-fg'>배달 정보</h2>
                  <p className='mt-1.5 text-title font-bold text-fg'>{copy.headline}</p>
                  <p className='mt-0.5 text-note text-fg-muted tabular-nums'>{copy.description}</p>
                </div>

                <ol className='flex flex-col gap-3.5'>
                  <li className='flex gap-3'>
                    {renderStepIcon('store', !isPickedUp)}
                    <div className='min-w-0 flex-1 leading-[1.45]'>
                      <p className='text-note text-fg-muted'>픽업지</p>
                      <p className='font-bold text-fg'>{delivery.storeName}</p>
                      <p className='text-note text-fg-muted'>{delivery.pickupAddress}</p>
                    </div>
                    <span className='text-note whitespace-nowrap text-fg-muted tabular-nums'>
                      {delivery.pickedUpAt ? `${formatTime(delivery.pickedUpAt)} 픽업` : '픽업 전'}
                    </span>
                  </li>
                  <li className='flex gap-3'>
                    {renderStepIcon('home', isPickedUp)}
                    <div className='min-w-0 flex-1 leading-[1.45]'>
                      <p className='text-note text-fg-muted'>배달지</p>
                      <p className='font-bold text-fg'>{delivery.deliveryAddress}</p>
                    </div>
                    <Button
                      variant='secondary'
                      size='md'
                      className='px-3 text-note'
                      onClick={() => void handleCopyAddressClick(delivery.deliveryAddress)}
                    >
                      주소 복사
                    </Button>
                  </li>
                </ol>

                {delivery.riderRequest ? (
                  <div className='grid grid-cols-[52px_minmax(0,1fr)] gap-x-2 rounded-control bg-muted-soft px-3 py-2.5'>
                    <span className='text-note leading-[1.75] font-semibold text-fg-muted'>라이더</span>
                    <span className='text-fg'>{delivery.riderRequest}</span>
                  </div>
                ) : null}

                <div className='flex items-center gap-2.5 border-t border-border pt-3.5'>
                  <p className='flex-1'>
                    <span className='text-fg-muted tabular-nums'>주문 #{delivery.orderId} · 배달비</span>{' '}
                    <span className='font-bold whitespace-nowrap text-fg tabular-nums'>
                      {formatPrice(delivery.deliveryFee)}
                    </span>
                  </p>
                  {delivery.customerPhone ? (
                    <a
                      href={getTelHref(delivery.customerPhone)}
                      aria-label={`고객 전화 ${delivery.customerPhone}`}
                      className={getButtonClassName({ variant: 'outline', size: 'md' })}
                    >
                      <Icon
                        name='phone'
                        size={14}
                      />
                      고객 전화
                    </a>
                  ) : null}
                </div>
              </Card>
              <Button
                block
                size='lg'
                className='hidden desktop:inline-flex'
                disabled={isSubmitting}
                onClick={() => handleActionClick(delivery)}
              >
                {isSubmitting ? '처리 중…' : copy.cta}
              </Button>
            </div>
          </div>

          <div className='sticky bottom-0 -mx-4 -mb-6 flex flex-col gap-1.5 border-t border-border bg-surface px-4 pt-3 pb-6 tablet:-mx-6 tablet:-mb-10 tablet:px-6 desktop:hidden'>
            <Button
              block
              size='lg'
              disabled={isSubmitting}
              onClick={() => handleActionClick(delivery)}
            >
              {isSubmitting ? '처리 중…' : copy.cta}
            </Button>
            <p className='text-center text-note text-fg-muted'>{copy.hint}</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
