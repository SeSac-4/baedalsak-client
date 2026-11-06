import { useQueries } from '@tanstack/react-query';

import { geocodeAddress, type LatLngLiteral } from './geocode-address';

/** 주소 → 좌표 캐시 키. 같은 주소는 다시 찾지 않는다 */
export const geocodeKeys = {
  all: ['kakao-geocode'] as const,
  address: (address: string) => [...geocodeKeys.all, address] as const,
};

export interface AddressCoordsResult {
  /** 주소와 같은 순서의 좌표. 찾는 중이거나 못 찾으면 null */
  coords: (LatLngLiteral | null)[];
  isPending: boolean;
  /** SDK 로딩·주소 검색 중 하나라도 실패했는지 */
  isError: boolean;
}

/**
 * 여러 주소를 좌표로 바꾼다 (카카오 주소 검색). 결과는 캐시해서 화면을 다시 열어도 다시 찾지 않는다.
 * @param addresses - 주소 목록
 * @returns 주소 순서대로의 좌표와 로딩·실패 여부
 */
export const useAddressCoords = (addresses: string[]): AddressCoordsResult => {
  const results = useQueries({
    queries: addresses.map((address) => ({
      queryKey: geocodeKeys.address(address),
      queryFn: (): Promise<LatLngLiteral | null> => geocodeAddress(address),
      staleTime: Infinity,
      retry: 1,
    })),
  });

  return {
    coords: results.map((result) => result.data ?? null),
    isPending: results.some((result) => result.isPending),
    isError: results.some((result) => result.isError),
  };
};
