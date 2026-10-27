import { zodResolver } from '@hookform/resolvers/zod';
import { useId, type ReactNode } from 'react';
import { useForm, type Path } from 'react-hook-form';

import type { Menu } from '@/entities/menu';
import { getErrorMessage, getFieldErrors } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';
import { Textarea } from '@/shared/ui/textarea';
import { useToast } from '@/shared/ui/toast';

import { menuSchema, type MenuFormValues } from '../model/menu-schema';
import { useUpsertMenu } from '../model/use-upsert-menu';

export interface MenuFormModalProps {
  open: boolean;
  storeId: number;
  /** 수정할 메뉴 (없으면 추가 모드) */
  menu: Menu | null;
  onClose: () => void;
}

const LABEL_CLASS = 'flex flex-col gap-1 text-note font-medium text-fg-muted';
const ERROR_CLASS = 'text-note text-warn';
const MENU_FIELDS: readonly string[] = ['name', 'description', 'price'];

/**
 * 서버 필드명이 폼 필드인지 확인한다.
 * @param field - 서버 errors[].field
 * @returns 폼 필드 여부
 */
const isMenuField = (field: string): field is Path<MenuFormValues> => MENU_FIELDS.includes(field);

/**
 * 메뉴 추가·수정 폼 모달. 이름·설명·가격을 검증해 저장하고, 서버 필드 에러는 해당 필드 아래에 보여 준다.
 * @param props open(열림 여부), storeId(가게 ID), menu(수정할 메뉴), onClose(닫기)
 * @returns 메뉴 폼 모달 요소
 */
export function MenuFormModal({ open, storeId, menu, onClose }: MenuFormModalProps): ReactNode {
  const formId = useId();
  const toast = useToast();
  const isEdit = menu !== null;
  const { mutateAsync: upsertMenu } = useUpsertMenu(storeId);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: { name: menu?.name ?? '', description: menu?.description ?? '', price: menu?.price },
  });

  /**
   * 메뉴를 저장하고 닫는다. 필드 검증 실패는 필드에, 그 밖의 에러는 토스트로 알린다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: MenuFormValues): Promise<void> => {
    try {
      await upsertMenu({
        menuId: menu?.id ?? null,
        request: { name: values.name, description: values.description || null, price: values.price },
      });
      toast(isEdit ? '메뉴를 수정했어요.' : '메뉴를 등록했어요.');
      onClose();
    } catch (error: unknown) {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors.length === 0) {
        toast(getErrorMessage(error));
        return;
      }
      fieldErrors.forEach(({ field, reason }) => {
        setError(isMenuField(field) ? field : 'root', { message: reason });
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? '메뉴 수정' : '메뉴 추가'}
      footer={
        <>
          <Button
            variant='secondary'
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            type='submit'
            form={formId}
            disabled={isSubmitting}
          >
            {isEdit ? '저장' : '등록'}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        noValidate
        onSubmit={handleSubmit(handleValidSubmit)}
        className='flex flex-col gap-3'
      >
        <label className={LABEL_CLASS}>
          메뉴명
          <Input
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
          {errors.name ? <span className={ERROR_CLASS}>{errors.name.message}</span> : null}
        </label>
        <label className={LABEL_CLASS}>
          설명
          <Textarea
            maxLength={500}
            placeholder='선택 입력'
            aria-invalid={Boolean(errors.description)}
            {...register('description')}
          />
          {errors.description ? <span className={ERROR_CLASS}>{errors.description.message}</span> : null}
        </label>
        <label className={LABEL_CLASS}>
          가격 (원)
          <Input
            type='number'
            min={1}
            step={500}
            aria-invalid={Boolean(errors.price)}
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price ? <span className={ERROR_CLASS}>{errors.price.message}</span> : null}
        </label>
        {errors.root ? <p className={ERROR_CLASS}>{errors.root.message}</p> : null}
      </form>
    </Modal>
  );
}
