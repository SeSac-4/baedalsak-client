import { apiClient } from '@/shared/api';

/**
 * 회원 탈퇴한다 (지금은 고객만). 서버는 204로 응답하며 인증 쿠키 두 개를 지운다.
 * 사장님·라이더·테스트 계정은 403 WITHDRAWAL_NOT_ALLOWED, 이미 탈퇴했으면 404.
 * @returns 완료 Promise
 */
export const removeMember = async (): Promise<void> => {
  await apiClient.delete('/members/me');
};
