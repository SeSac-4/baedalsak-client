import { getErrorMessage, getFieldErrors } from '@/shared/api';

import { ImageUploadError } from '../api/upload-image-api';

const S3_ERROR_MESSAGE = '사진을 올리지 못했어요. 다시 시도해 주세요.';

/**
 * 사진 업로드 실패를 안내 문구로 바꾼다. S3 실패는 고정 문구, 서버 검증 실패는 첫 필드 사유, 그 밖은 서버 메시지.
 * @param error - 업로드 중 발생한 에러
 * @returns 안내 문구
 */
export const formatUploadError = (error: unknown): string => {
  if (error instanceof ImageUploadError) return S3_ERROR_MESSAGE;
  const [fieldError] = getFieldErrors(error);
  return fieldError ? fieldError.reason : getErrorMessage(error);
};
