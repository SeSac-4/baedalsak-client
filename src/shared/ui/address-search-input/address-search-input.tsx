import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { openAddressSearch } from '@/shared/lib/daum-postcode';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { FIELD_CLASS } from '@/shared/ui/input';
import { useToast } from '@/shared/ui/toast';

const SEARCH_ERROR_MESSAGE = '주소 검색을 열지 못했어요. 잠시 후 다시 시도해 주세요.';

export interface AddressSearchInputProps extends Omit<
  ComponentProps<'input'>,
  'value' | 'onChange' | 'readOnly' | 'type'
> {
  value: string;
  /** 우편번호 검색에서 고른 주소 (도로명 우선) */
  onChange: (address: string) => void;
}

/**
 * 주소 입력칸. 직접 입력할 수 없고, 입력칸이나 '주소 검색' 버튼을 누르면 다음 우편번호 검색을 열어 고른 주소를 넣는다.
 * @param props value(주소), onChange(고른 주소), input 속성 (ref 포함)
 * @returns 주소 입력 요소
 */
export function AddressSearchInput({
  value,
  onChange,
  className,
  disabled,
  ...props
}: AddressSearchInputProps): ReactNode {
  const toast = useToast();

  /** 우편번호 검색을 열고, 고르면 도로명 주소를 넣는다. 닫으면 그대로 둔다. */
  const handleSearch = async (): Promise<void> => {
    try {
      const picked = await openAddressSearch(value || undefined);
      if (picked) onChange(picked.roadAddress || picked.address);
    } catch {
      toast(SEARCH_ERROR_MESSAGE);
    }
  };

  return (
    <div className='flex w-full gap-2'>
      <input
        type='text'
        readOnly
        value={value}
        disabled={disabled}
        onClick={() => void handleSearch()}
        className={cn(FIELD_CLASS, 'min-w-0 flex-1 cursor-pointer', className)}
        {...props}
      />
      <Button
        variant='secondary'
        disabled={disabled}
        onClick={() => void handleSearch()}
        className='h-11.5 shrink-0'
      >
        <Icon
          name='search'
          size={18}
        />
        주소 검색
      </Button>
    </div>
  );
}
