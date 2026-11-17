import type { PostcodeAddress } from '@/shared/lib/daum-postcode';
import { geocodeAddress } from '@/shared/lib/kakao-map';

import type { AddressLocation } from '../model/address-types';

/**
 * 우편번호 검색 결과에서 배달지 동을 뽑는다. 읍·면 지역은 리 대신 읍·면 이름을 쓴다.
 * @param picked - 우편번호 검색 결과
 * @returns 배달지 동 (예: 성수동2가, 봉담읍)
 */
export const getAddressDong = (picked: PostcodeAddress): string => picked.bname1 || picked.bname;

/**
 * 우편번호 검색에서 고른 주소를 저장할 값(도로명 · 동 · 좌표)으로 바꾼다. 좌표는 카카오 주소 검색으로 구한다.
 * @param address - 고른 도로명 주소
 * @param picked - 우편번호 검색 결과
 * @returns 주소 위치 (좌표를 못 구하면 null → 저장을 막는다)
 */
export const getAddressLocation = async (address: string, picked: PostcodeAddress): Promise<AddressLocation | null> => {
  const position = await geocodeAddress(address).catch(() => null);
  if (!position) return null;
  return { address, dong: getAddressDong(picked), lat: position.lat, lng: position.lng };
};
