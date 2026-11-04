import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useState, type ReactNode } from 'react';
import { Controller, useForm, useWatch, type Path } from 'react-hook-form';

import type { Menu } from '@/entities/menu';
import { ImageUploadCard } from '@/features/store/upload-image';
import { getErrorMessage, getFieldErrors } from '@/shared/api';
import { formatAmount, parseAmount } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';
import { Notice } from '@/shared/ui/notice';
import { Textarea } from '@/shared/ui/textarea';
import { useToast } from '@/shared/ui/toast';

import { menuSchema, type MenuFormValues } from '../model/menu-schema';
import { useUpsertMenu } from '../model/use-upsert-menu';

export interface MenuFormModalProps {
  storeId: number;
  /** 수정할 메뉴 (없으면 추가 모드) */
  menu: Menu | null;
  onClose: () => void;
}

const DESCRIPTION_MAX_LENGTH = 500;
const IMAGE_HINT = 'JPG·PNG·WEBP, 5MB 이하. 가게 상세 메뉴 목록에 정사각형으로 보여요.';
const MENU_FIELDS: readonly string[] = ['name', 'description', 'price', 'imageKey'];

/**
 * 서버 필드명이 폼 필드인지 확인한다.
 * @param field - 서버 errors[].field
 * @returns 폼 필드 여부
 */
const isMenuField = (field: string): field is Path<MenuFormValues> => MENU_FIELDS.includes(field);

/**
 * 메뉴 추가·수정 폼 모달. 사진·이름·설명·가격을 검증해 저장한다. 열 때마다 새로 그려 입력값을 초기화한다.
 * 서버 필드 에러는 해당 필드 아래에, 그 밖의 에러는 폼 아래 안내 상자에 보여 준다.
 * @param props storeId(가게 ID), menu(수정할 메뉴), onClose(닫기)
 * @returns 메뉴 폼 모달 요소
 */
export function MenuFormModal({ storeId, menu, onClose }: MenuFormModalProps): ReactNode {
  const id = useId();
  const formId = `${id}-form`;
  const toast = useToast();
  const isEdit = menu !== null;
  const { mutateAsync: upsertMenu } = useUpsertMenu(storeId);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: menu?.name ?? '',
      description: menu?.description ?? '',
      price: menu?.price,
      imageKey: menu?.imageKey ?? null,
    },
  });
  const description = useWatch({ control, name: 'description' });

  /**
   * 메뉴를 저장하고 닫는다. 필드 검증 실패는 필드에, 그 밖의 에러는 폼 아래에 보여 준다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: MenuFormValues): Promise<void> => {
    try {
      await upsertMenu({
        menuId: menu?.id ?? null,
        request: {
          name: values.name,
          description: values.description || null,
          price: values.price,
          imageKey: values.imageKey,
        },
      });
      toast(isEdit ? '메뉴를 수정했어요.' : '메뉴를 등록했어요.', 'success');
      onClose();
    } catch (error: unknown) {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors.length === 0) {
        setError('root', { message: getErrorMessage(error) });
        return;
      }
      fieldErrors.forEach(({ field, reason }) => {
        setError(isMenuField(field) ? field : 'root', { message: reason });
      });
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isEdit ? '메뉴 수정' : '메뉴 추가'}
      footer={
        <>
          <Button
            variant='secondary'
            size='lg'
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            type='submit'
            form={formId}
            size='lg'
            disabled={isSubmitting || isImageUploading}
          >
            저장
          </Button>
        </>
      }
    >
      <form
        id={formId}
        noValidate
        onSubmit={handleSubmit(handleValidSubmit)}
        className='flex flex-col gap-3.5'
      >
        <FormField
          id={`${id}-image`}
          label={
            <>
              메뉴 사진 <span className='font-normal text-fg-muted'>(선택)</span>
            </>
          }
          isGroup
          error={errors.imageKey?.message}
        >
          <Controller
            control={control}
            name='imageKey'
            render={({ field }) => (
              <ImageUploadCard
                layout='compact'
                storeId={storeId}
                target='MENU'
                imageUrl={menu?.imageUrl ?? null}
                value={field.value}
                onChange={field.onChange}
                onPendingChange={setIsImageUploading}
                alt={menu?.name ?? '새 메뉴'}
                hint={IMAGE_HINT}
              />
            )}
          />
        </FormField>
        <FormField
          id={`${id}-name`}
          label='메뉴 이름'
          error={errors.name?.message}
        >
          <Input
            id={`${id}-name`}
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${id}-name-message` : undefined}
            {...register('name')}
          />
        </FormField>
        <FormField
          id={`${id}-description`}
          label={
            <>
              설명 <span className='font-normal text-fg-muted'>(선택)</span>
            </>
          }
          aside={`${description.length}/${DESCRIPTION_MAX_LENGTH}`}
          error={errors.description?.message}
        >
          <Textarea
            id={`${id}-description`}
            maxLength={DESCRIPTION_MAX_LENGTH}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? `${id}-description-message` : undefined}
            {...register('description')}
          />
        </FormField>
        <FormField
          id={`${id}-price`}
          label='가격'
          hint='숫자만 입력해 주세요.'
          error={errors.price?.message}
        >
          <Controller
            control={control}
            name='price'
            render={({ field }) => (
              <Input
                ref={field.ref}
                id={`${id}-price`}
                name={field.name}
                inputMode='numeric'
                suffix='원'
                value={formatAmount(field.value)}
                onChange={(event) => field.onChange(parseAmount(event.target.value))}
                onBlur={field.onBlur}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={`${id}-price-message`}
                className='text-right tabular-nums'
              />
            )}
          />
        </FormField>
        {errors.root ? (
          <Notice
            tone='warn'
            role='alert'
          >
            {errors.root.message}
          </Notice>
        ) : null}
      </form>
    </Modal>
  );
}
