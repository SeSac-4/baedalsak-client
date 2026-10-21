import type { FormEvent, ReactNode } from 'react';

import { CATEGORY_LIST_MOCK } from '@/entities/category';
import type { StoreDetail } from '@/entities/store';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';

/** 가게 등록·수정 폼 기본값 */
export type StoreFormValues = Pick<StoreDetail, 'name' | 'category' | 'address' | 'minOrderAmount' | 'deliveryFee'>;

export interface StoreFormProps {
  defaultValues?: Partial<StoreFormValues>;
  submitLabel: string;
}

/**
 * 제출 시 새로고침을 막는다. (API 연동 전 임시)
 * @param event 폼 제출 이벤트
 */
const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
  event.preventDefault();
};

/**
 * 가게 이름·카테고리·주소·최소주문금액·배달비 입력 폼 (O-00 등록 · O-04 수정 공용).
 * @param props defaultValues(입력 기본값), submitLabel(제출 버튼 문구)
 * @returns 가게 정보 폼 요소
 */
export function StoreForm({ defaultValues, submitLabel }: StoreFormProps): ReactNode {
  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4'
    >
      <div className='grid gap-3 tablet:grid-cols-2'>
        <label className='flex flex-col gap-1 text-note font-medium text-fg-muted'>
          가게 이름
          <Input
            name='name'
            defaultValue={defaultValues?.name}
          />
        </label>
        <label className='flex flex-col gap-1 text-note font-medium text-fg-muted'>
          카테고리
          <Select
            name='category'
            defaultValue={defaultValues?.category ?? CATEGORY_LIST_MOCK[0].code}
          >
            {CATEGORY_LIST_MOCK.map((category) => (
              <option
                key={category.code}
                value={category.code}
              >
                {category.name}
              </option>
            ))}
          </Select>
        </label>
        <label className='flex flex-col gap-1 text-note font-medium text-fg-muted tablet:col-span-2'>
          주소
          <Input
            name='address'
            defaultValue={defaultValues?.address}
          />
        </label>
        <label className='flex flex-col gap-1 text-note font-medium text-fg-muted'>
          최소주문금액
          <Input
            name='minOrderAmount'
            type='number'
            min={0}
            step={1000}
            defaultValue={defaultValues?.minOrderAmount}
          />
        </label>
        <label className='flex flex-col gap-1 text-note font-medium text-fg-muted'>
          배달비
          <Input
            name='deliveryFee'
            type='number'
            min={0}
            step={500}
            defaultValue={defaultValues?.deliveryFee}
          />
        </label>
      </div>
      <div>
        <Button type='submit'>{submitLabel}</Button>
      </div>
    </form>
  );
}
