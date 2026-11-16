import { apiClient } from '@/shared/api';

import type { StoreDetail, StoreListFilter, StoreListSummary, StorePage } from '../model/store-types';

/** 내 위치로 거를 때 반경 (m). 서버 기본값과 같고, 화면 안내 문구에도 쓴다 */
export const NEARBY_RADIUS_M = 3000;

/** GET /stores · GET /stores/summary 쿼리 파라미터 */
interface StoreListParams {
  category?: StoreListFilter['category'];
  q?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

/**
 * 조회 조건을 쿼리 파라미터로 바꾼다. 빈 검색어는 빼고, 위치가 있으면 위도·경도·반경을 함께 보낸다 (하나만 보내면 400).
 * @param filter - 조회 조건
 * @returns 쿼리 파라미터
 */
const parseStoreListParams = ({ category, q, position }: StoreListFilter): StoreListParams => ({
  category,
  q: q || undefined,
  ...(position ? { lat: position.lat, lng: position.lng, radius: NEARBY_RADIUS_M } : {}),
});

/**
 * 가게 목록 한 페이지를 등록순으로 조회한다. 조건을 생략하면 전체, 커서를 생략하면 첫 페이지.
 * 위치를 넘기면 반경 안의 가게만 오고, 각 가게에 거리(distanceM)가 붙는다.
 * @param filter - 카테고리·검색어·내 위치
 * @param cursor - 이전 응답의 nextCursor
 * @returns 가게 목록 페이지
 */
export const getStoreList = async (filter: StoreListFilter, cursor?: string): Promise<StorePage> => {
  const { data } = await apiClient.get<StorePage>('/stores', { params: { ...parseStoreListParams(filter), cursor } });
  return data;
};

/**
 * 가게 목록 통계(전체·영업 중·카테고리별 가게 수, 최저 배달비)를 조회한다. 위치를 넘기면 반경 안의 가게 기준이다.
 * @param position - 내 위치 (없으면 전체 기준)
 * @returns 가게 목록 통계
 */
export const getStoreListSummary = async (position?: StoreListFilter['position']): Promise<StoreListSummary> => {
  const { data } = await apiClient.get<StoreListSummary>('/stores/summary', {
    params: parseStoreListParams({ position }),
  });
  return data;
};

/**
 * 가게 상세를 조회한다. 없으면 404 STORE_NOT_FOUND.
 * @param storeId - 가게 ID
 * @returns 가게 상세
 */
export const getStore = async (storeId: number): Promise<StoreDetail> => {
  const { data } = await apiClient.get<StoreDetail>(`/stores/${storeId}`);
  return data;
};

/**
 * 내 가게(사장님)를 조회한다. 아직 등록하지 않았으면 404 STORE_NOT_FOUND.
 * @returns 내 가게 상세
 */
export const getMyStore = async (): Promise<StoreDetail> => {
  const { data } = await apiClient.get<StoreDetail>('/stores/me');
  return data;
};
