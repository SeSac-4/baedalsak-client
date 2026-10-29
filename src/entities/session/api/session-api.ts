import axios from 'axios';

import { apiClient } from '@/shared/api';

import type { MemberMe } from '../model/session-types';

/**
 * 내 정보를 조회한다. AT 만료(401)는 공용 axios가 갱신 후 재시도하고,
 * 갱신까지 401이면 로그인하지 않은 상태로 보고 null을 돌려준다.
 * @returns 내 정보 (비로그인이면 null)
 */
export const getMe = async (): Promise<MemberMe | null> => {
  try {
    const { data } = await apiClient.get<MemberMe>('/members/me');
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) return null;
    throw error;
  }
};
