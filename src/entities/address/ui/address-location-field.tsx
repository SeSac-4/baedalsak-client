import { useState, type ReactNode } from 'react';

import type { PostcodeAddress } from '@/shared/lib/daum-postcode';
import { AddressSearchInput } from '@/shared/ui/address-search-input';
import { FormField } from '@/shared/ui/form-field';
import { Spinner } from '@/shared/ui/spinner';

import { ADDRESS_GEOCODE_FAILED_MESSAGE } from '../config/address';
import { getAddressLocation } from '../lib/get-address-location';
import type { AddressLocation } from '../model/address-types';

export interface AddressLocationFieldProps {
  /** 입력칸 id */
  id: string;
  /** 라벨 (예: 주소 · 배달 주소 (선택)) */
  label: ReactNode;
  /** 고른 주소 위치 (아직 안 골랐거나 좌표를 못 구했으면 null) */
  value: AddressLocation | null;
  /** 주소를 고르고 좌표까지 구하면 위치, 좌표를 못 구하면 null */
  onChange: (location: AddressLocation | null) => void;
  /** 서버 오류 (400 errors[address · dong · lat · lng]) */
  error?: string | null;
  /** 회색 안내 문구 */
  hint?: ReactNode;
  disabled?: boolean;
}

/**
 * 배달 주소 검색 칸 (내 정보 · 가입 공용). 우편번호 검색에서 고른 도로명 · 동을 카카오 주소 검색으로 좌표까지 바꾼다.
 * 좌표를 못 구하면 값을 비우고 칸 아래에 다른 주소로 검색하라고 안내해 저장을 막는다.
 * @param props id, label, value(주소 위치), onChange, error(서버 오류), hint, disabled
 * @returns 주소 검색 칸
 */
export function AddressLocationField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  disabled = false,
}: AddressLocationFieldProps): ReactNode {
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  /**
   * 고른 주소의 좌표를 구해 넘긴다. 못 구하면 null을 넘기고 안내한다.
   * @param address - 고른 도로명 주소
   * @param picked - 우편번호 검색 결과
   */
  const handlePick = async (address: string, picked: PostcodeAddress): Promise<void> => {
    setIsLocating(true);
    setLocateError(null);
    const location = await getAddressLocation(address, picked);
    setIsLocating(false);
    if (!location) setLocateError(ADDRESS_GEOCODE_FAILED_MESSAGE);
    onChange(location);
  };

  const message = locateError ?? error ?? null;

  return (
    <FormField
      id={id}
      label={label}
      hint={
        isLocating ? (
          <span className='inline-flex items-center gap-1.5'>
            <Spinner size={12} />
            주소 위치를 확인하고 있어요.
          </span>
        ) : (
          hint
        )
      }
      error={message}
    >
      <AddressSearchInput
        id={id}
        placeholder='주소를 검색해 주세요'
        value={value?.address ?? ''}
        onChange={(address, picked) => void handlePick(address, picked)}
        disabled={disabled || isLocating}
        aria-invalid={Boolean(message)}
        aria-describedby={`${id}-message`}
      />
    </FormField>
  );
}
