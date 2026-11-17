import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { addressKeys, createAddress, updateAddress, type AddressRequest } from '@/entities/address';

/** 주소 저장 요청 (id가 있으면 수정, 없으면 추가) */
export interface SaveAddressRequest {
  id?: number;
  body: AddressRequest;
}

/**
 * 배달 주소를 추가(POST)하거나 수정(PUT)한다. 성공하면 주소 목록을 다시 불러온다.
 * @returns 주소 저장 뮤테이션
 */
export const useSaveAddress = (): UseMutationResult<void, Error, SaveAddressRequest> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: SaveAddressRequest): Promise<void> => {
      if (id === undefined) await createAddress(body);
      else await updateAddress({ id, body });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  });
};
