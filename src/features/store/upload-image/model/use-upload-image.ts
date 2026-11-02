import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { createUploadUrl, uploadImageFile, type ImageTarget } from '../api/upload-image-api';

/** 사진 업로드 인자 */
export interface UploadImageVariables {
  storeId: number;
  target: ImageTarget;
  file: File;
}

/**
 * 사진 업로드: 업로드 URL 받기 → S3에 바로 올리기. 성공하면 등록·수정 요청에 넣을 imageKey를 돌려준다.
 * 매번 새 URL을 받으므로 만료(5분)·S3 거부 뒤에도 다시 시도하면 된다.
 * @returns 사진 업로드 mutation (결과: imageKey)
 */
export const useUploadImage = (): UseMutationResult<string, unknown, UploadImageVariables> =>
  useMutation({
    mutationFn: async ({ storeId, target, file }: UploadImageVariables): Promise<string> => {
      const { uploadUrl, imageKey } = await createUploadUrl(storeId, {
        target,
        contentType: file.type,
        size: file.size,
      });
      await uploadImageFile(uploadUrl, file);
      return imageKey;
    },
  });
