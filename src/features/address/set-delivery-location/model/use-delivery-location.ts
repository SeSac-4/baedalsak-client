import type { UseQueryResult } from '@tanstack/react-query';

import { useAddressList, type DeliveryAddress } from '@/entities/address';
import { useMe } from '@/entities/session';
import { useCurrentLocation, type CurrentLocation, type LatLngLiteral } from '@/shared/lib/kakao-map';

import { useDeliveryLocationStore } from './delivery-location-store';

/** 가게 목록 기준 위치를 어디서 가져오는지: 정하는 중 · 기본 주소 · 브라우저 현재 위치 */
export type DeliveryLocationSource = 'pending' | 'address' | 'current';

/** 가게 목록 기준 위치 */
export interface DeliveryLocation {
  source: DeliveryLocationSource;
  /** 가게 목록 · 요약 조회 좌표 (아직 모르면 undefined → 전체 가게) */
  position: LatLngLiteral | undefined;
  /** source가 address일 때 쓰는 기본 주소 */
  address: DeliveryAddress | undefined;
  /** 내 주소 목록 (고객이 아니거나 없으면 빈 배열) */
  addresses: DeliveryAddress[];
  /** 로그인한 고객이고 저장된 주소가 있으면 true (헤더에서 주소를 고를 수 있음) */
  canChooseAddress: boolean;
  /** 브라우저 현재 위치 쿼리 (source가 current일 때만 위치를 묻는다) */
  current: UseQueryResult<CurrentLocation>;
  /** 위치를 아직 정하지 못함 (그동안 전체 가게) */
  isPending: boolean;
}

const EMPTY_ADDRESSES: DeliveryAddress[] = [];

/**
 * 가게 목록 기준 위치를 정한다 (헤더 위치 버튼 · 가게 목록 공용).
 * 로그인한 고객이 주소를 저장했으면 기본 주소 좌표, 헤더에서 [현재 위치로 보기]를 골랐거나
 * 비로그인 · 주소 없음 · 사장님 · 라이더면 브라우저 현재 위치를 쓴다. 기본 주소를 쓸 때는 브라우저 위치를 묻지 않는다.
 * @returns 기준 위치
 */
export const useDeliveryLocation = (): DeliveryLocation => {
  const { data: me, isPending: isMePending } = useMe();
  const isCustomer = me?.role === 'CUSTOMER';
  const { data: addressList, isPending: isAddressPending, isError: isAddressError } = useAddressList(isCustomer);
  const prefersCurrent = useDeliveryLocationStore((state) => state.prefersCurrent);

  const addresses = (isCustomer ? addressList : undefined) ?? EMPTY_ADDRESSES;
  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0];
  // 주소 목록을 못 불러오면(오류) 기다리지 않고 현재 위치로
  const isDeciding = isMePending || (isCustomer && isAddressPending && !isAddressError);
  const source: DeliveryLocationSource = isDeciding
    ? 'pending'
    : defaultAddress && !prefersCurrent
      ? 'address'
      : 'current';
  const current = useCurrentLocation(source === 'current');

  const position =
    source === 'address' && defaultAddress
      ? { lat: defaultAddress.lat, lng: defaultAddress.lng }
      : source === 'current'
        ? current.data?.position
        : undefined;

  return {
    source,
    position,
    address: source === 'address' ? defaultAddress : undefined,
    addresses,
    canChooseAddress: addresses.length > 0,
    current,
    isPending: source === 'pending' || (source === 'current' && current.isPending),
  };
};
