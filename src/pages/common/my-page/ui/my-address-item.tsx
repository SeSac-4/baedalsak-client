import { useState, type ReactNode } from 'react';

import { formatAddressName, parseAddressError, type DeliveryAddress } from '@/entities/address';
import { useSetDefaultAddress } from '@/features/address/set-delivery-location';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/ui/toast';

import { useRemoveAddress } from '../model/use-remove-address';

export interface MyAddressItemProps {
  address: DeliveryAddress;
  /** [수정]을 누르면 이 주소 수정 폼을 연다 */
  onEditClick: () => void;
  /** 다른 주소를 고치는 중이면 버튼을 막는다 */
  disabled?: boolean;
}

const REMOVED_MESSAGE = '배달 주소를 삭제했어요.';
const DEFAULT_SET_MESSAGE = '기본 주소로 정했어요.';

/**
 * 내 정보(C-06) 배달 주소 한 줄. 별칭(없으면 동) · 기본 배지 · 주소 · 상세 주소와 [기본으로] · [수정] · [삭제]를 보여 준다.
 * 삭제는 한 번 더 확인한다 (줄 안에서 [취소] · [삭제]).
 * @param props address(주소), onEditClick(수정 열기), disabled(버튼 막기)
 * @returns 주소 줄 요소
 */
export function MyAddressItem({ address, onEditClick, disabled = false }: MyAddressItemProps): ReactNode {
  const toast = useToast();
  const [isConfirmingRemove, setIsConfirmingRemove] = useState<boolean>(false);
  const { mutate: removeAddress, isPending: isRemoving } = useRemoveAddress();
  const { mutate: setDefaultAddress, isPending: isSettingDefault } = useSetDefaultAddress();
  const isBusy = disabled || isRemoving || isSettingDefault;

  /**
   * 실패 사유를 토스트로 알린다 (404: 이미 지워진 주소 등).
   * @param error - 요청 에러
   */
  const showError = (error: unknown): void => {
    parseAddressError(error).forEach((parsed) => toast(parsed.message));
  };

  /** 이 주소를 기본 주소로 정한다 */
  const handleDefaultClick = (): void => {
    setDefaultAddress(address, {
      onSuccess: () => toast(DEFAULT_SET_MESSAGE, 'success'),
      onError: showError,
    });
  };

  /** 확인 단계에서 [삭제]를 누르면 지운다 */
  const handleRemoveConfirm = (): void => {
    removeAddress(address.id, {
      onSuccess: () => toast(REMOVED_MESSAGE, 'success'),
      onError: (error: unknown) => {
        setIsConfirmingRemove(false);
        showError(error);
      },
    });
  };

  return (
    <li className='flex flex-col gap-2 border-b border-border py-3 last:border-b-0'>
      <div className='flex flex-col gap-0.5'>
        <div className='flex items-center gap-1.5'>
          <span className='min-w-0 truncate font-semibold text-fg'>{formatAddressName(address)}</span>
          {address.isDefault ? <Badge tone='role'>기본</Badge> : null}
        </div>
        <p className='text-note wrap-break-word text-fg-muted'>{address.address}</p>
        {address.addressDetail ? (
          <p className='text-note wrap-break-word text-fg-muted'>{address.addressDetail}</p>
        ) : null}
      </div>
      {isConfirmingRemove ? (
        <div
          role='group'
          aria-label='주소 삭제 확인'
          className='flex flex-wrap items-center gap-2 rounded-control bg-warn-soft px-3 py-2'
        >
          <span className='min-w-0 flex-1 text-note text-warn'>이 주소를 삭제할까요?</span>
          <Button
            variant='ghost'
            size='sm'
            disabled={isRemoving}
            onClick={() => setIsConfirmingRemove(false)}
          >
            취소
          </Button>
          <Button
            variant='danger'
            size='sm'
            disabled={isRemoving}
            onClick={handleRemoveConfirm}
          >
            삭제
          </Button>
        </div>
      ) : (
        <div className='flex flex-wrap gap-1.5'>
          {address.isDefault ? null : (
            <Button
              variant='outline'
              size='sm'
              disabled={isBusy}
              onClick={handleDefaultClick}
            >
              기본으로
            </Button>
          )}
          <Button
            variant='secondary'
            size='sm'
            disabled={isBusy}
            onClick={onEditClick}
          >
            수정
          </Button>
          <Button
            variant='danger-secondary'
            size='sm'
            disabled={isBusy}
            onClick={() => setIsConfirmingRemove(true)}
          >
            삭제
          </Button>
        </div>
      )}
    </li>
  );
}
