import { apiClient } from '@/shared/api';

/** 사진 대상: 가게 사진 / 메뉴 사진 */
export type ImageTarget = 'STORE' | 'MENU';

/** 업로드 URL 요청 본문 */
export interface UploadUrlRequest {
  target: ImageTarget;
  /** image/jpeg · image/png · image/webp */
  contentType: string;
  /** 파일 크기 (바이트) */
  size: number;
}

/** 업로드 URL 응답. uploadUrl은 5분 뒤 만료된다 */
export interface UploadUrl {
  uploadUrl: string;
  /** stores/{storeId}/{uuid}.{ext} — 가게·메뉴 등록/수정 요청에 넣는다 */
  imageKey: string;
  /** ISO 8601 */
  expiresAt: string;
}

/** S3 업로드 실패 (S3는 서버 에러 형식이 아니라 XML을 돌려줘서 따로 구분한다) */
export class ImageUploadError extends Error {
  readonly status: number;

  /**
   * @param status - S3 응답 상태 코드 (네트워크 실패면 0)
   */
  constructor(status: number) {
    super(`S3 upload failed: ${status}`);
    this.name = 'ImageUploadError';
    this.status = status;
  }
}

/**
 * 사진 업로드 URL(presigned)을 받는다. 서버는 서명만 하고 S3는 호출하지 않는다.
 * @param storeId - 가게 ID (내 가게만, 다른 가게면 403)
 * @param request - 대상·형식·크기
 * @returns 업로드 URL·이미지 키
 */
export const createUploadUrl = async (storeId: number, request: UploadUrlRequest): Promise<UploadUrl> => {
  const { data } = await apiClient.post<UploadUrl>(`/stores/${storeId}/images/upload-url`, request);
  return data;
};

/**
 * 사진 파일을 S3에 바로 올린다. 공용 axios를 쓰지 않는다:
 * 버킷 CORS가 Content-Type 헤더만 허용하므로 쿠키·X-Requested-With 없이 보내고, Content-Type은 서명 값과 같아야 한다.
 * @param uploadUrl - presigned PUT 주소
 * @param file - 올릴 파일
 */
export const uploadImageFile = async (uploadUrl: string, file: File): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
    credentials: 'omit',
  }).catch((): never => {
    throw new ImageUploadError(0);
  });
  if (!response.ok) throw new ImageUploadError(response.status);
};
