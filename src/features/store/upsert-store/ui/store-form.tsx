import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { useForm, type Path } from 'react-hook-form';

import { useCategoryList } from '@/entities/category';
import { getFieldErrors } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';

import { storeSchema, type StoreFormValues } from '../model/store-schema';

export interface StoreFormProps {
  defaultValues?: Partial<StoreFormValues>;
  submitLabel: string;
  /** 제출 처리. 400 VALIDATION_FAILED를 그대로 던지면 errors[]를 필드 에러로 보여 준다 */
  onSubmit: (values: StoreFormValues) => Promise<void>;
}

const LABEL_CLASS = 'flex flex-col gap-1 text-note font-medium text-fg-muted';
const ERROR_CLASS = 'text-note text-warn';
const STORE_FIELDS: readonly string[] = ['name', 'category', 'address', 'minOrderAmount', 'deliveryFee'];

/**
 * 서버 필드명이 폼 필드인지 확인한다.
 * @param field - 서버 errors[].field
 * @returns 폼 필드 여부
 */
const isStoreField = (field: string): field is Path<StoreFormValues> => STORE_FIELDS.includes(field);

/**
 * 가게 이름·카테고리·주소·최소주문금액·배달비 입력 폼 (O-00 등록 · O-04 수정 공용).
 * Zod로 먼저 검증하고, 서버 검증 실패(errors[])는 해당 필드 아래에 보여 준다.
 * @param props defaultValues(입력 기본값), submitLabel(제출 버튼 문구), onSubmit(제출 처리)
 * @returns 가게 정보 폼 요소
 */
export function StoreForm({ defaultValues, submitLabel, onSubmit }: StoreFormProps): ReactNode {
  const { data: categories } = useCategoryList();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: { name: '', category: 'KOREAN', address: '', ...defaultValues },
  });

  /**
   * 제출하고, 서버 필드 에러가 오면 필드에 표시한다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: StoreFormValues): Promise<void> => {
    try {
      await onSubmit(values);
    } catch (error: unknown) {
      getFieldErrors(error).forEach(({ field, reason }) => {
        setError(isStoreField(field) ? field : 'root', { message: reason });
      });
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
      className='flex flex-col gap-4'
    >
      <div className='grid gap-3 tablet:grid-cols-2'>
        <label className={LABEL_CLASS}>
          가게 이름
          <Input
            aria-invalid={Boolean(errors.name)}
            maxLength={100}
            {...register('name')}
          />
          {errors.name ? <span className={ERROR_CLASS}>{errors.name.message}</span> : null}
        </label>
        <label className={LABEL_CLASS}>
          카테고리
          <Select
            aria-invalid={Boolean(errors.category)}
            {...register('category')}
          >
            {categories?.map((category) => (
              <option
                key={category.code}
                value={category.code}
              >
                {category.name}
              </option>
            ))}
          </Select>
          {errors.category ? <span className={ERROR_CLASS}>{errors.category.message}</span> : null}
        </label>
        <label className={`${LABEL_CLASS} tablet:col-span-2`}>
          주소
          <Input
            aria-invalid={Boolean(errors.address)}
            maxLength={255}
            {...register('address')}
          />
          {errors.address ? <span className={ERROR_CLASS}>{errors.address.message}</span> : null}
        </label>
        <label className={LABEL_CLASS}>
          최소주문금액 (원)
          <Input
            type='number'
            min={0}
            step={1000}
            aria-invalid={Boolean(errors.minOrderAmount)}
            {...register('minOrderAmount', { valueAsNumber: true })}
          />
          {errors.minOrderAmount ? <span className={ERROR_CLASS}>{errors.minOrderAmount.message}</span> : null}
        </label>
        <label className={LABEL_CLASS}>
          배달비 (원)
          <Input
            type='number'
            min={0}
            step={500}
            aria-invalid={Boolean(errors.deliveryFee)}
            {...register('deliveryFee', { valueAsNumber: true })}
          />
          {errors.deliveryFee ? <span className={ERROR_CLASS}>{errors.deliveryFee.message}</span> : null}
        </label>
      </div>
      {errors.root ? <p className={ERROR_CLASS}>{errors.root.message}</p> : null}
      <div>
        <Button
          type='submit'
          disabled={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
