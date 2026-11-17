import { apiClient } from '@/shared/api';

import type { AddressRequest, DeliveryAddress } from '../model/address-types';

const ADDRESSES_PATH = '/members/me/addresses';

/** 주소 수정 요청 (주소 ID + 본문) */
export interface UpdateAddressRequest {
  id: number;
  body: AddressRequest;
}

/**
 * 내 배달 주소 목록을 조회한다 (고객만). 기본 주소가 먼저, 나머지는 최근 순.
 * @returns 주소 목록
 */
export const getAddressList = async (): Promise<DeliveryAddress[]> => {
  const { data } = await apiClient.get<DeliveryAddress[]>(ADDRESSES_PATH);
  return data;
};

/**
 * 배달 주소를 추가한다 (201). 첫 주소는 자동으로 기본 주소. 이미 3개면 409 ADDRESS_LIMIT_EXCEEDED.
 * @param body - 주소 본문
 * @returns 추가된 주소
 */
export const createAddress = async (body: AddressRequest): Promise<DeliveryAddress> => {
  const { data } = await apiClient.post<DeliveryAddress>(ADDRESSES_PATH, body);
  return data;
};

/**
 * 배달 주소를 수정한다 (204). isDefault가 true면 이 주소가 기본 주소가 된다. 없거나 남의 주소면 404.
 * @param request - 주소 ID와 본문
 */
export const updateAddress = async ({ id, body }: UpdateAddressRequest): Promise<void> => {
  await apiClient.put(`${ADDRESSES_PATH}/${id}`, body);
};

/**
 * 배달 주소를 삭제한다 (204). 기본 주소를 지우면 남은 것 중 가장 최근 주소가 기본이 된다.
 * @param id - 주소 ID
 */
export const removeAddress = async (id: number): Promise<void> => {
  await apiClient.delete(`${ADDRESSES_PATH}/${id}`);
};
