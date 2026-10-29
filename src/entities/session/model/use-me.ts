import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getMe } from '../api/session-api';
import { sessionKeys } from '../api/session-query';
import type { MemberMe } from './session-types';

/**
 * 로그인한 내 정보를 조회한다. data가 null이면 비로그인, 있으면 data.role로 역할을 본다.
 * 라우트 가드·내 정보 화면이 같은 캐시를 쓴다.
 * @returns 내 정보 쿼리 결과
 */
export const useMe = (): UseQueryResult<MemberMe | null> =>
  useQuery({
    queryKey: sessionKeys.me(),
    queryFn: getMe,
  });
