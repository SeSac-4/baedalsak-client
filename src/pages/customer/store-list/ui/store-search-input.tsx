import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Icon } from '@/shared/ui/icon';
import { IconButton } from '@/shared/ui/icon-button';
import { Input } from '@/shared/ui/input';

/** 서버 검색어 최대 길이 (넘으면 400 VALIDATION_FAILED) */
const MAX_KEYWORD_LENGTH = 50;

export interface StoreSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  /** 엔터로 바로 검색할 때 */
  onSubmit: () => void;
  /** 지우기(×) 버튼 */
  onClear: () => void;
  className?: string;
}

/**
 * 가게 이름 검색창. 왼쪽 돋보기, 입력이 있으면 오른쪽 지우기 버튼을 둔다. 엔터를 누르면 기다리지 않고 바로 검색한다.
 * @param props value(입력값), onChange, onSubmit(엔터), onClear(지우기), className
 * @returns 검색 폼 요소
 */
export function StoreSearchInput({ value, onChange, onSubmit, onClear, className }: StoreSearchInputProps): ReactNode {
  return (
    <form
      role='search'
      className={cn('relative', className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Icon
        name='search'
        size={18}
        className='pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-fg-subtle'
      />
      <Input
        type='search'
        enterKeyHint='search'
        aria-label='가게 이름으로 찾기'
        placeholder='가게 이름으로 찾기'
        maxLength={MAX_KEYWORD_LENGTH}
        autoComplete='off'
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className='pr-11 pl-10 [&::-webkit-search-cancel-button]:appearance-none'
      />
      {value ? (
        <IconButton
          icon='close'
          label='검색어 지우기'
          variant='ghost'
          size='sm'
          className='absolute top-1/2 right-1 -translate-y-1/2'
          onClick={onClear}
        />
      ) : null}
    </form>
  );
}
