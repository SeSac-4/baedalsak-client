import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { addressKeys, parseDefaultAddressRequest, updateAddress, type DeliveryAddress } from '@/entities/address';

/**
 * 저장된 주소를 기본 주소로 지정한다 (PUT isDefault: true). 서버에 저장되어 다른 기기에서도 같은 주소가 기본이 된다.
 * 성공하면 주소 목록을 다시 불러온다 (헤더 · 가게 목록 · 내 정보 · 주문서가 함께 바뀐다).
 * @returns 기본 주소 지정 뮤테이션
 */
export const useSetDefaultAddress = (): UseMutationResult<void, Error, DeliveryAddress> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (address: DeliveryAddress) =>
      updateAddress({ id: address.id, body: parseDefaultAddressRequest(address) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  });
};
