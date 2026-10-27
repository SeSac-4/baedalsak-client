import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getMyStore } from '../api/store-api';
import { storeKeys } from '../api/store-query';
import type { StoreDetail } from './store-types';

/**
 * 내 가게(사장님)를 조회한다. 사장님 라우트 가드와 사장님 화면이 같은 캐시를 쓴다.
 * @returns 내 가게 쿼리 결과
 */
export const useMyStore = (): UseQueryResult<StoreDetail> =>
  useQuery({
    queryKey: storeKeys.me(),
    queryFn: getMyStore,
  });
