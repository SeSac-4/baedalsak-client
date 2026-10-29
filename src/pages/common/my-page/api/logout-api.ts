import { apiClient } from '@/shared/api';

/**
 * 로그아웃한다. 서버는 세션 쿠키만으로 처리하고 항상 204로 응답하며 인증 쿠키 두 개를 지운다.
 * @returns 완료 Promise
 */
export const logoutMember = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};
