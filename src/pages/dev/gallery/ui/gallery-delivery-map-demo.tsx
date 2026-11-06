import { useState, type ReactNode } from 'react';

import type { DeliveryStatus } from '@/entities/delivery';
import { openAddressSearch } from '@/shared/lib/daum-postcode';
import type { LatLngLiteral } from '@/shared/lib/kakao-map';
import { Button } from '@/shared/ui/button';
import { ChoiceButton, ChoiceGroup } from '@/shared/ui/choice';
import { DeliveryMap } from '@/widgets/delivery-map';

/** 갤러리 전시용 예시 값 (local-seed 의 가게 주소와 같은 성수동) */
const SAMPLE_STORE_ADDRESS = '서울 성동구 성수이로 120';
const SAMPLE_DELIVERY_ADDRESS = '서울 성동구 왕십리로 83-21';
/** 가게와 배달지 사이 어딘가 (라이더 위치 API 연동 전 가짜 좌표) */
const SAMPLE_RIDER_POSITION: LatLngLiteral = { lat: 37.5437, lng: 127.0497 };

const STATUS_OPTIONS: { value: DeliveryStatus; label: string }[] = [
  { value: 'ASSIGNED', label: '배차완료' },
  { value: 'PICKED_UP', label: '픽업완료' },
  { value: 'DELIVERED', label: '배달완료' },
];

/**
 * 배달 지도 데모. 상태를 바꿔 보고, 주소 검색 팝업으로 배달지를 골라 지도에 바로 찍어 본다.
 * @returns 데모 요소
 */
export function GalleryDeliveryMapDemo(): ReactNode {
  const [status, setStatus] = useState<DeliveryStatus>('PICKED_UP');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(SAMPLE_DELIVERY_ADDRESS);
  const [showsRider, setShowsRider] = useState<boolean>(true);

  /** 주소 검색 팝업을 열어 고른 도로명 주소를 배달지로 쓴다. */
  const handleAddressSearchClick = async (): Promise<void> => {
    const picked = await openAddressSearch();
    if (picked) setDeliveryAddress(picked.roadAddress || picked.address);
  };

  return (
    <div className='flex w-full flex-col gap-3'>
      <ChoiceGroup
        aria-label='배달 상태'
        className='w-full'
      >
        {STATUS_OPTIONS.map((option) => (
          <ChoiceButton
            key={option.value}
            selected={status === option.value}
            onClick={() => setStatus(option.value)}
          >
            {option.label}
          </ChoiceButton>
        ))}
      </ChoiceGroup>
      <div className='flex flex-wrap items-center gap-2'>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => void handleAddressSearchClick()}
        >
          배달지 주소 검색
        </Button>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => setShowsRider((prev) => !prev)}
        >
          {showsRider ? '라이더 숨기기' : '라이더 보이기'}
        </Button>
        <span className='text-note text-fg-muted'>
          가게: {SAMPLE_STORE_ADDRESS} · 배달지: {deliveryAddress}
        </span>
      </div>
      <DeliveryMap
        storeAddress={SAMPLE_STORE_ADDRESS}
        deliveryAddress={deliveryAddress}
        status={status}
        riderPosition={showsRider ? SAMPLE_RIDER_POSITION : null}
      />
    </div>
  );
}
