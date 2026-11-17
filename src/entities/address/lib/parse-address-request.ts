import type { AddressLocation, AddressRequest, DeliveryAddress } from '../model/address-types';

/** 주소 입력값 (별칭 · 상세 주소는 비어 있을 수 있음) */
export interface AddressInput {
  location: AddressLocation;
  label: string;
  addressDetail: string;
}

/**
 * 주소 입력값을 요청 본문으로 바꾼다. 빈 별칭 · 상세 주소는 보내지 않는다.
 * @param input - 위치 · 별칭 · 상세 주소
 * @returns 주소 본문 (isDefault 없음)
 */
export const parseAddressRequest = ({ location, label, addressDetail }: AddressInput): AddressRequest => ({
  ...location,
  label: label.trim() || undefined,
  addressDetail: addressDetail.trim() || undefined,
});

/**
 * 저장된 주소를 그대로 기본 주소로 지정하는 수정 본문을 만든다 (PUT은 본문 전체를 덮어쓴다).
 * @param address - 저장된 주소
 * @returns isDefault: true 수정 본문
 */
export const parseDefaultAddressRequest = (address: DeliveryAddress): AddressRequest => ({
  address: address.address,
  dong: address.dong,
  lat: address.lat,
  lng: address.lng,
  label: address.label ?? undefined,
  addressDetail: address.addressDetail ?? undefined,
  isDefault: true,
});
