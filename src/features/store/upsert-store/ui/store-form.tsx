import { zodResolver } from '@hookform/resolvers/zod';
import { useId, type ReactNode } from 'react';
import { Controller, useForm, type Path } from 'react-hook-form';

import { useCategoryList } from '@/entities/category';
import { getErrorMessage, getFieldErrors } from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { ChoiceButton, ChoiceGroup } from '@/shared/ui/choice';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Notice } from '@/shared/ui/notice';

import { storeSchema, type StoreFormValues } from '../model/store-schema';

export interface StoreFormProps {
  /** create: 기본 정보·주문 조건 두 카드 + 아래 제출 (O-00) · edit: '가게 정보' 한 카드 안에 제출 (O-04) */
  variant: 'create' | 'edit';
  defaultValues?: Partial<StoreFormValues>;
  submitLabel: string;
  /** 제출 처리. 실패하면 그대로 던진다 — errors[]는 필드 아래에, 그 밖의 에러는 폼 아래 안내 상자에 보여 준다 */
  onSubmit: (values: StoreFormValues) => Promise<void>;
  /** 제출 버튼 바로 위에 둘 안내 (create) */
  notice?: ReactNode;
}

const STORE_FIELDS: readonly string[] = ['name', 'category', 'address', 'minOrderAmount', 'deliveryFee'];
const CARD_TITLE_CLASS = 'font-bold text-fg';

/**
 * 서버 필드명이 폼 필드인지 확인한다.
 * @param field - 서버 errors[].field
 * @returns 폼 필드 여부
 */
const isStoreField = (field: string): field is Path<StoreFormValues> => STORE_FIELDS.includes(field);

/**
 * 금액을 입력칸 표시용 문자열로 바꾼다 (12000 → '12,000', 비어 있으면 '').
 * @param value - 금액 (비어 있으면 NaN)
 * @returns 쉼표를 넣은 금액 문자열
 */
const formatAmount = (value: number | undefined): string =>
  value === undefined || Number.isNaN(value) ? '' : value.toLocaleString('ko-KR');

/**
 * 입력한 글자에서 숫자만 남겨 금액으로 바꾼다 (비어 있으면 NaN → 검증에서 걸린다).
 * @param text - 입력한 글자
 * @returns 금액
 */
const parseAmount = (text: string): number => {
  const digits = text.replace(/\D/g, '');
  return digits === '' ? Number.NaN : Number(digits);
};

/**
 * 가게 이름·카테고리·주소·최소주문금액·배달비 입력 폼 (O-00 등록 · O-04 수정 공용).
 * Zod로 먼저 검증하고, 서버 검증 실패(errors[])는 해당 필드 아래에 보여 준다. 사진은 O-04의 사진 카드가 따로 저장한다.
 * @param props variant, defaultValues(입력 기본값), submitLabel(제출 버튼 문구), onSubmit(제출 처리), notice(제출 위 안내)
 * @returns 가게 정보 폼 요소
 */
export function StoreForm({ variant, defaultValues, submitLabel, onSubmit, notice }: StoreFormProps): ReactNode {
  const id = useId();
  const { data: categories } = useCategoryList();
  const isCreate = variant === 'create';
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: { name: '', address: '', ...defaultValues },
  });

  /**
   * 제출하고, 서버 필드 에러가 오면 필드에 표시한다. 필드 에러가 없는 실패는 서버 메시지를 폼 아래에 보여 준다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: StoreFormValues): Promise<void> => {
    try {
      await onSubmit(values);
    } catch (error: unknown) {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors.length === 0) {
        setError('root', { message: getErrorMessage(error) });
        return;
      }
      fieldErrors.forEach(({ field, reason }) => {
        setError(isStoreField(field) ? field : 'root', { message: reason });
      });
    }
  };

  /**
   * 금액 입력칸을 만든다 (쉼표 표시, 숫자 키패드, 오른쪽 '원').
   * @param name - 폼 필드
   * @param label - 라벨
   * @returns 금액 입력 항목
   */
  const renderAmountField = (name: 'minOrderAmount' | 'deliveryFee', label: string): ReactNode => (
    <FormField
      id={`${id}-${name}`}
      label={label}
      error={errors[name]?.message}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            ref={field.ref}
            id={`${id}-${name}`}
            name={field.name}
            inputMode='numeric'
            suffix='원'
            value={formatAmount(field.value)}
            onChange={(event) => field.onChange(parseAmount(event.target.value))}
            onBlur={field.onBlur}
            aria-invalid={Boolean(errors[name])}
            aria-describedby={errors[name] ? `${id}-${name}-message` : undefined}
            className='text-right tabular-nums'
          />
        )}
      />
    </FormField>
  );

  const basicFields = (
    <>
      <FormField
        id={`${id}-name`}
        label='가게 이름'
        hint={isCreate ? '회원가입 때 입력한 가게 이름이 채워져 있어요. 100자까지 쓸 수 있어요.' : undefined}
        error={errors.name?.message}
      >
        <Input
          id={`${id}-name`}
          maxLength={100}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={`${id}-name-message`}
          {...register('name')}
        />
      </FormField>
      <FormField
        id={`${id}-category`}
        label='카테고리'
        isGroup
        error={errors.category?.message}
      >
        <Controller
          control={control}
          name='category'
          render={({ field }) => (
            <ChoiceGroup
              aria-labelledby={`${id}-category-label`}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={`${id}-category-message`}
            >
              {categories?.map((category) => (
                <ChoiceButton
                  key={category.code}
                  selected={field.value === category.code}
                  onClick={() => field.onChange(category.code)}
                  className={cn(errors.category && 'border-warn')}
                >
                  {category.name}
                </ChoiceButton>
              ))}
            </ChoiceGroup>
          )}
        />
      </FormField>
      <FormField
        id={`${id}-address`}
        label='가게 주소'
        hint={isCreate ? '라이더가 픽업하러 오는 주소예요.' : undefined}
        error={errors.address?.message}
      >
        <Input
          id={`${id}-address`}
          maxLength={255}
          aria-invalid={Boolean(errors.address)}
          aria-describedby={`${id}-address-message`}
          {...register('address')}
        />
      </FormField>
    </>
  );

  const amountFields = (
    <div className='grid grid-cols-2 gap-2'>
      {renderAmountField('minOrderAmount', '최소주문금액')}
      {renderAmountField('deliveryFee', '배달비')}
    </div>
  );

  const rootError = errors.root ? (
    <Notice
      tone='warn'
      role='alert'
    >
      {errors.root.message}
    </Notice>
  ) : null;

  if (!isCreate) {
    return (
      <form
        noValidate
        onSubmit={handleSubmit(handleValidSubmit)}
      >
        <Card className='flex flex-col gap-4'>
          <h2 className={CARD_TITLE_CLASS}>가게 정보</h2>
          {basicFields}
          {amountFields}
          {rootError}
          <Button
            type='submit'
            size='lg'
            block
            disabled={isSubmitting}
          >
            {submitLabel}
          </Button>
        </Card>
      </form>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
      className='flex flex-col gap-3 tablet:gap-3.5 desktop:gap-4'
    >
      <Card className='flex flex-col gap-4'>
        <h2 className={CARD_TITLE_CLASS}>기본 정보</h2>
        {basicFields}
      </Card>
      <Card className='flex flex-col gap-4'>
        <h2 className={CARD_TITLE_CLASS}>주문 조건</h2>
        <div className='flex flex-col gap-1.5'>
          {amountFields}
          {errors.minOrderAmount || errors.deliveryFee ? null : (
            <p className='text-note text-fg-muted'>0원도 입력할 수 있어요. 숫자만 입력해 주세요.</p>
          )}
        </div>
      </Card>
      {notice}
      {rootError}
      <div className='sticky bottom-0 -mx-4 border-t border-border bg-surface px-4 pt-3 pb-6 tablet:-mx-6 tablet:px-6 desktop:static desktop:mx-0 desktop:border-0 desktop:bg-transparent desktop:p-0'>
        <Button
          type='submit'
          size='lg'
          block
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className='size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent' />
          ) : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
