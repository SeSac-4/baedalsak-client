import type { QueryClient } from '@tanstack/react-query';

import { sessionKeys } from '../api/session-query';

/**
 * 로그아웃·세션 만료 때 쿼리 캐시를 모두 비우고 내 정보를 비로그인(null)으로 둔다.
 * null을 채워 두지 않으면 비운 직후 내 정보를 다시 요청해 401 → 갱신 → 만료가 반복된다.
 * @param queryClient - 앱 QueryClient
 */
export const clearSession = (queryClient: QueryClient): void => {
  queryClient.clear();
  queryClient.setQueryData(sessionKeys.me(), null);
};
