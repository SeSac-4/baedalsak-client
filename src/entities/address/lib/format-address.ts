import type { DeliveryAddress } from '../model/address-types';

/**
 * 주소를 짧게 부를 이름 (별칭, 없으면 동). 헤더 위치 버튼 · 목록 제목에 쓴다.
 * @param address - 저장된 주소
 * @returns 예: 집, 성수동2가
 */
export const formatAddressName = (address: DeliveryAddress): string => address.label?.trim() || address.dong;

/**
 * 도로명 주소와 상세 주소를 한 줄로 합친다.
 * @param address - 저장된 주소
 * @returns 예: 서울 성동구 성수이로 77 302호
 */
export const formatAddressLine = (address: DeliveryAddress): string =>
  `${address.address} ${address.addressDetail ?? ''}`.trim();
