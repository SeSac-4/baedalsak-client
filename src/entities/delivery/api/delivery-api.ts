import { apiClient } from '@/shared/api';

import type {
  Delivery,
  DeliveryLocation,
  DeliveryPoint,
  DeliveryRoute,
  RiderDelivery,
  RiderDeliveryHistory,
  WaitingDeliveryPage,
  WaitingSort,
} from '../model/delivery-types';

const HTTP_NO_CONTENT = 204;

/**
 * 배차 대기 목록을 정렬해 조회한다. (라이더) 항목마다 내 위치 기준 예상 시간이 있다.
 * @param page - 페이지 번호 (0부터)
 * @param size - 페이지 크기 (최대 100)
 * @param sort - 정렬 (빠른 배달순 · 배달비 높은순)
 * @returns 배차 대기 배달 목록 페이지
 */
export const getWaitingDeliveryList = async (
  page: number,
  size: number,
  sort: WaitingSort,
): Promise<WaitingDeliveryPage> => {
  const { data } = await apiClient.get<WaitingDeliveryPage>('/deliveries/waiting', { params: { page, size, sort } });
  return data;
};

/**
 * 내가 진행 중인 배달(배차 완료·픽업 완료)을 조회한다. (라이더) 고객 연락처는 이 응답에만 있다.
 * @returns 진행 중 배달 (없으면 204 → null)
 */
export const getActiveDelivery = async (): Promise<RiderDelivery | null> => {
  const { data, status } = await apiClient.get<RiderDelivery>('/deliveries/me/active');
  return status === HTTP_NO_CONTENT ? null : data;
};

/**
 * 내가 기간 안에 완료한 배달을 최근 완료 순으로 조회한다. (라이더) 날짜는 한국 날짜, 최대 93일.
 * @param from - 시작 날짜 (YYYY-MM-DD, 포함)
 * @param to - 끝 날짜 (YYYY-MM-DD, 포함)
 * @returns 완료한 배달 목록
 */
export const getDeliveryHistory = async (from: string, to: string): Promise<RiderDeliveryHistory[]> => {
  const { data } = await apiClient.get<RiderDeliveryHistory[]>('/deliveries/me/history', { params: { from, to } });
  return data;
};

/**
 * 주문의 배달 상태를 조회한다. (고객·사장님)
 * @param orderId - 주문 ID
 * @returns 배달 상태 (결제대기·결제완료·수락 직후처럼 배달 생성 전이면 204 → null)
 */
export const getDeliveryByOrder = async (orderId: number): Promise<Delivery | null> => {
  const { data, status } = await apiClient.get<Delivery>(`/deliveries/by-order/${orderId}`);
  return status === HTTP_NO_CONTENT ? null : data;
};

/**
 * 내 현재 위치를 조회한다. (라이더) 가상 위치면 처음 볼 때 배차 대기 가게 바로 주변에 정해진다.
 * @returns 현재 위치 (둘 곳이 없거나 모르면 204 → null)
 */
export const getMyRiderPosition = async (): Promise<DeliveryPoint | null> => {
  const { data, status } = await apiClient.get<DeliveryPoint>('/deliveries/me/position');
  return status === HTTP_NO_CONTENT ? null : data;
};

/**
 * 주문의 지금 구간 경로를 조회한다. (고객·사장님·배정된 라이더) 배차 완료면 라이더 → 가게, 픽업 후면 가게 → 배달지.
 * @param orderId - 주문 ID
 * @returns 경로 (배차 전이거나 아직 계산 전이면 204 → null)
 */
export const getDeliveryRoute = async (orderId: number): Promise<DeliveryRoute | null> => {
  const { data, status } = await apiClient.get<DeliveryRoute>(`/deliveries/by-order/${orderId}/route`);
  return status === HTTP_NO_CONTENT ? null : data;
};

/**
 * 주문의 배달 상태와 라이더 현재 위치를 조회한다. (고객·사장님·배정된 라이더)
 * @param orderId - 주문 ID
 * @returns 상태 + 위치 (배달 생성 전이면 204 → null)
 */
export const getDeliveryLocation = async (orderId: number): Promise<DeliveryLocation | null> => {
  const { data, status } = await apiClient.get<DeliveryLocation>(`/deliveries/by-order/${orderId}/location`);
  return status === HTTP_NO_CONTENT ? null : data;
};
