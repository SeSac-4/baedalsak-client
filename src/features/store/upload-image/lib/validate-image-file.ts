/** 올릴 수 있는 사진 형식 (서버·인프라와 같은 기준) */
export const IMAGE_CONTENT_TYPES: readonly string[] = ['image/jpeg', 'image/png', 'image/webp'];

/** 사진 최대 크기: 5MB (바이트) */
export const IMAGE_MAX_SIZE = 5 * 1024 * 1024;

/**
 * 사진 파일을 올리기 전에 형식·크기를 확인한다.
 * @param file - 고른 파일
 * @returns 문제가 있으면 안내 문구, 없으면 null
 */
export const validateImageFile = (file: File): string | null => {
  if (!IMAGE_CONTENT_TYPES.includes(file.type)) return 'JPG·PNG·WEBP 사진만 올릴 수 있어요.';
  if (file.size < 1) return '빈 파일은 올릴 수 없어요.';
  if (file.size > IMAGE_MAX_SIZE) return '5MB 이하 사진만 올릴 수 있어요.';
  return null;
};
