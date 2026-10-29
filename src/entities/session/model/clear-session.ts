import type { QueryClient } from '@tanstack/react-query';

import { sessionKeys } from '../api/session-query';

/**
 * 로그아웃·세션 만료 때 다른 쿼리 캐시를 모두 지우고 내 정보를 비로그인(null)으로 둔다.
 * 내 정보 쿼리는 지우지 않고 null로 바꾼다. 지우면 진행 중인 요청이 조용히 취소돼 가드가 로딩에 멈추고,
 * 비우기만 하면 화면에 붙은 쿼리가 다시 요청해 401 → 갱신 → 만료가 반복된다.
 * @param queryClient - 앱 QueryClient
 */
export const clearSession = (queryClient: QueryClient): void => {
  queryClient.removeQueries({ predicate: (query): boolean => query.queryKey[0] !== sessionKeys.all[0] });
  queryClient.setQueryData(sessionKeys.me(), null);
};
