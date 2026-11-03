import type { StoreDetail } from '@/entities/store';

import type { StoreUpsertRequest } from '../api/upsert-store-api';
import type { StoreFormValues } from '../model/store-schema';

/**
 * 저장된 가게 정보에 바꿀 값을 덮어 수정 요청을 만든다. 수정은 전체 교체라 바꾸지 않는 값도 저장된 값으로 채운다.
 * @param store - 저장된 가게 상세
 * @param changes - 바꿀 값 (가게 정보 폼 값 또는 사진 키)
 * @returns 가게 수정 요청 본문
 */
export const parseStoreRequest = (
  store: StoreDetail,
  changes: Partial<StoreFormValues> & { imageKey?: string | null },
): StoreUpsertRequest => ({
  name: store.name,
  category: store.category,
  address: store.address,
  minOrderAmount: store.minOrderAmount,
  deliveryFee: store.deliveryFee,
  imageKey: store.imageKey,
  ...changes,
});
