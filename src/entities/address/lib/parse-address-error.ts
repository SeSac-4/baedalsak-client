import axios from 'axios';

import { getErrorCode, getErrorMessage, getFieldErrors } from '@/shared/api';

import { ADDRESS_LIMIT_MESSAGE } from '../config/address';

const ADDRESS_LIMIT_CODE = 'ADDRESS_LIMIT_EXCEEDED';

/** 주소 입력 칸 (서버 errors[].field와 같은 이름) */
export type AddressField = 'label' | 'address' | 'addressDetail' | 'dong' | 'lat' | 'lng';

const ADDRESS_FIELDS: readonly string[] = ['label', 'address', 'addressDetail', 'dong', 'lat', 'lng'];

/** 주소 저장 실패를 어디에 보여 줄지 */
export type AddressError =
  /** 칸 아래 (400 errors[필드]). dong · lat · lng는 주소 칸에 보여 준다 */
  | { type: 'field'; field: AddressField; message: string }
  /** 409: 3개 다 참 */
  | { type: 'limit'; message: string }
  /** 403 · 404 · 503 · 네트워크: 토스트 */
  | { type: 'toast'; message: string };

/**
 * 서버 필드명을 주소 칸으로 바꾼다. 가입에서는 `address.lat`처럼 앞에 `address.`가 붙는다.
 * @param field - 서버 errors[].field
 * @returns 주소 칸 (주소 칸이 아니면 null)
 */
export const parseAddressField = (field: string): AddressField | null => {
  const name = field.startsWith('address.') ? field.slice('address.'.length) : field;
  return ADDRESS_FIELDS.includes(name) ? (name as AddressField) : null;
};

/**
 * 주소 추가 · 수정 · 삭제 에러를 표시 방법별로 나눈다.
 * @param error - 요청 에러
 * @returns 표시 방법 목록 (필드 오류는 여러 개일 수 있다)
 */
export const parseAddressError = (error: unknown): AddressError[] => {
  if (getErrorCode(error) === ADDRESS_LIMIT_CODE) return [{ type: 'limit', message: ADDRESS_LIMIT_MESSAGE }];
  if (axios.isAxiosError(error) && error.response?.status === 400) {
    const fieldErrors = getFieldErrors(error).flatMap(({ field, reason }): AddressError[] => {
      const addressField = parseAddressField(field);
      return addressField ? [{ type: 'field', field: addressField, message: reason }] : [];
    });
    if (fieldErrors.length > 0) return fieldErrors;
  }
  return [{ type: 'toast', message: getErrorMessage(error) }];
};
