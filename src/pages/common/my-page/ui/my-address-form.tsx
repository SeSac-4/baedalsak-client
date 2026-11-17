import { useId, useState, type FormEvent, type ReactNode } from 'react';

import {
  ADDRESS_DETAIL_MAX_LENGTH,
  ADDRESS_LABEL_MAX_LENGTH,
  AddressLocationField,
  parseAddressError,
  parseAddressRequest,
  type AddressField,
  type AddressLocation,
  type DeliveryAddress,
} from '@/entities/address';
import { Button } from '@/shared/ui/button';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Notice } from '@/shared/ui/notice';
import { Spinner } from '@/shared/ui/spinner';
import { useToast } from '@/shared/ui/toast';

import { useSaveAddress } from '../model/use-save-address';

export interface MyAddressFormProps {
  /** 수정할 주소 (없으면 추가) */
  address?: DeliveryAddress;
  /** 저장했거나 [취소]를 누르면 닫는다 */
  onClose: () => void;
}

/** 칸별 오류 (dong · lat · lng는 주소 칸에 모은다) */
type FieldErrors = Partial<Record<'label' | 'address' | 'addressDetail', string>>;

const SAVED_MESSAGE = '배달 주소를 저장했어요.';
const ADDRESS_REQUIRED_MESSAGE = '주소를 검색해 주세요.';

/**
 * 서버 주소 칸을 화면 칸으로 바꾼다. 동 · 좌표는 주소 검색 결과라 주소 칸에 보여 준다.
 * @param field - 서버 주소 칸
 * @returns 화면 칸
 */
const getFormField = (field: AddressField): keyof FieldErrors =>
  field === 'label' || field === 'addressDetail' ? field : 'address';

/**
 * 저장된 주소를 입력 위치로 바꾼다.
 * @param address - 저장된 주소 (없으면 null)
 * @returns 주소 위치
 */
const getInitialLocation = (address: DeliveryAddress | undefined): AddressLocation | null =>
  address ? { address: address.address, dong: address.dong, lat: address.lat, lng: address.lng } : null;

/**
 * 내 정보(C-06) 배달 주소 추가 · 수정 폼. 주소 검색(좌표까지 구함) · 상세 주소 · 별칭을 받아 저장한다.
 * 좌표를 못 구하면 저장을 막고, 서버 오류는 칸 아래 · 3개 초과는 안내 상자 · 그 밖은 토스트로 보여 준다.
 * @param props address(수정할 주소), onClose(닫기)
 * @returns 주소 폼 요소
 */
export function MyAddressForm({ address, onClose }: MyAddressFormProps): ReactNode {
  const id = useId();
  const toast = useToast();
  const { mutate: saveAddress, isPending } = useSaveAddress();
  const [location, setLocation] = useState<AddressLocation | null>(() => getInitialLocation(address));
  const [addressDetail, setAddressDetail] = useState<string>(address?.addressDetail ?? '');
  const [label, setLabel] = useState<string>(address?.label ?? '');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<string | null>(null);

  /**
   * 저장 실패를 칸 아래 · 안내 상자 · 토스트로 나눠 보여 준다.
   * @param error - 저장 에러
   */
  const showSaveError = (error: unknown): void => {
    const nextErrors: FieldErrors = {};
    parseAddressError(error).forEach((parsed) => {
      if (parsed.type === 'field') nextErrors[getFormField(parsed.field)] = parsed.message;
      else if (parsed.type === 'limit') setNotice(parsed.message);
      else toast(parsed.message);
    });
    setFieldErrors(nextErrors);
  };

  /**
   * 주소를 저장한다. 주소(좌표 포함)가 없으면 막는다.
   * @param event - 폼 제출 이벤트
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setNotice(null);
    if (!location) {
      setFieldErrors({ address: ADDRESS_REQUIRED_MESSAGE });
      return;
    }
    setFieldErrors({});
    saveAddress(
      { id: address?.id, body: parseAddressRequest({ location, label, addressDetail }) },
      {
        onSuccess: () => {
          toast(SAVED_MESSAGE, 'success');
          onClose();
        },
        onError: showSaveError,
      },
    );
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label={address ? '배달 주소 수정' : '배달 주소 추가'}
      className='flex flex-col gap-3 rounded-control border border-border p-3.5'
    >
      <AddressLocationField
        id={`${id}-address`}
        label='주소'
        value={location}
        onChange={(next) => {
          setLocation(next);
          setFieldErrors((prev) => ({ ...prev, address: undefined }));
        }}
        error={fieldErrors.address}
        disabled={isPending}
      />
      <FormField
        id={`${id}-detail`}
        label='상세 주소'
        error={fieldErrors.addressDetail}
      >
        <Input
          id={`${id}-detail`}
          value={addressDetail}
          onChange={(event) => setAddressDetail(event.target.value)}
          placeholder='예: 302호'
          maxLength={ADDRESS_DETAIL_MAX_LENGTH}
          disabled={isPending}
          aria-invalid={Boolean(fieldErrors.addressDetail)}
          aria-describedby={`${id}-detail-message`}
        />
      </FormField>
      <FormField
        id={`${id}-label`}
        label='별칭'
        hint='비워 두면 동 이름으로 보여요.'
        error={fieldErrors.label}
      >
        <Input
          id={`${id}-label`}
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder='예: 집, 회사'
          maxLength={ADDRESS_LABEL_MAX_LENGTH}
          disabled={isPending}
          aria-invalid={Boolean(fieldErrors.label)}
          aria-describedby={`${id}-label-message`}
        />
      </FormField>
      {notice ? (
        <Notice
          tone='warn'
          role='alert'
        >
          {notice}
        </Notice>
      ) : null}
      <div className='flex justify-end gap-2'>
        <Button
          variant='ghost'
          size='sm'
          disabled={isPending}
          onClick={onClose}
        >
          취소
        </Button>
        <Button
          type='submit'
          size='sm'
          disabled={isPending}
        >
          {isPending ? (
            <Spinner
              size={14}
              label='저장 중'
              className='border-current border-t-transparent'
            />
          ) : null}
          저장
        </Button>
      </div>
    </form>
  );
}
