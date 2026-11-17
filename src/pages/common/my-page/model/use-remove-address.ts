import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { addressKeys, removeAddress } from '@/entities/address';

/**
 * 배달 주소를 삭제한다. 성공하면 주소 목록을 다시 불러온다 (기본 주소를 지웠으면 서버가 정한 새 기본 주소가 보인다).
 * @returns 주소 삭제 뮤테이션
 */
export const useRemoveAddress = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: addressKeys.all }),
  });
};
