import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getAddressList } from '../api/address-api';
import { addressKeys } from '../api/address-query';
import type { DeliveryAddress } from './address-types';

/**
 * 내 배달 주소 목록을 조회한다. 헤더 · 가게 목록 · 내 정보 · 주문서가 같은 캐시를 쓴다.
 * @param enabled - 로그인한 고객일 때만 true (사장님 · 라이더는 403)
 * @returns 주소 목록 쿼리 결과
 */
export const useAddressList = (enabled: boolean = true): UseQueryResult<DeliveryAddress[]> =>
  useQuery({
    queryKey: addressKeys.list(),
    queryFn: getAddressList,
    enabled,
  });
