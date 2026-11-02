import { useEffect, useId, useState, type ChangeEvent, type ReactNode } from 'react';

import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';
import { Thumbnail } from '@/shared/ui/thumbnail';

import type { ImageTarget } from '../api/upload-image-api';
import { formatUploadError } from '../lib/format-upload-error';
import { IMAGE_CONTENT_TYPES, validateImageFile } from '../lib/validate-image-file';
import { useUploadImage } from '../model/use-upload-image';

export interface ImageUploadCardProps {
  storeId: number;
  target: ImageTarget;
  /** 저장된 사진 주소 (value가 저장된 키일 때 보여 준다) */
  imageUrl: string | null;
  /** 폼 값: 지금 선택된 사진 키 (사진 없음이면 null) */
  value: string | null;
  /** 업로드가 끝나면 새 키, 삭제하면 null */
  onChange: (imageKey: string | null) => void;
  /** 업로드 중 여부 (폼이 저장 버튼을 막을 때 쓴다) */
  onPendingChange?: (isPending: boolean) => void;
  /** 사진 대체 텍스트 (예: 가게 이름) */
  alt: string;
  className?: string;
}

const ERROR_CLASS = 'text-note text-warn';

/**
 * 사진 선택·미리보기·삭제. 파일을 고르자마자 형식·크기를 확인하고 S3에 올린 뒤, 받은 imageKey를 폼 값으로 넘긴다.
 * 고른 파일은 올리는 동안에도 바로 미리 보여 주고, 실패하면 폼 값의 사진(직전 사진)으로 돌아간다.
 * @param props storeId·target(업로드 대상), imageUrl(저장된 사진), value·onChange(폼 값), onPendingChange, alt
 * @returns 사진 업로드 요소
 */
export function ImageUploadCard({
  storeId,
  target,
  imageUrl,
  value,
  onChange,
  onPendingChange,
  alt,
  className,
}: ImageUploadCardProps): ReactNode {
  const inputId = useId();
  const [savedKey] = useState<string | null>(value);
  /** 올리는 중인 파일 미리보기 */
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null);
  /** 마지막으로 업로드에 성공한 파일 (폼 값이 이 키일 때 미리보기를 보여 준다) */
  const [uploaded, setUploaded] = useState<{ imageKey: string; previewUrl: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutateAsync: uploadImage, isPending } = useUploadImage();

  useEffect(
    () => () => {
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    },
    [pendingPreviewUrl],
  );

  useEffect(
    () => () => {
      if (uploaded) URL.revokeObjectURL(uploaded.previewUrl);
    },
    [uploaded],
  );

  /**
   * 보여 줄 사진을 고른다: 올리는 중인 파일 → 폼 값이 방금 올린 키면 그 파일 → 저장된 키면 저장된 사진 → 없음.
   * 업로드가 실패해도 폼 값은 그대로라 화면도 폼 값의 사진으로 돌아간다.
   * @returns 사진 주소 (없으면 null)
   */
  const getDisplaySrc = (): string | null => {
    if (pendingPreviewUrl) return pendingPreviewUrl;
    if (value === null) return null;
    if (uploaded?.imageKey === value) return uploaded.previewUrl;
    return value === savedKey ? imageUrl : null;
  };

  /**
   * 파일을 고르면 확인 후 바로 올린다.
   * @param event - 파일 입력 변경 이벤트
   */
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const invalidMessage = validateImageFile(file);
    if (invalidMessage) {
      setErrorMessage(invalidMessage);
      return;
    }

    setErrorMessage(null);
    setPendingPreviewUrl(URL.createObjectURL(file));
    onPendingChange?.(true);
    try {
      const imageKey = await uploadImage({ storeId, target, file });
      setUploaded({ imageKey, previewUrl: URL.createObjectURL(file) });
      onChange(imageKey);
    } catch (error: unknown) {
      setErrorMessage(formatUploadError(error));
    } finally {
      setPendingPreviewUrl(null);
      onPendingChange?.(false);
    }
  };

  /** 사진을 지운다 (저장하면 사진 없음으로 바뀐다). */
  const handleRemoveClick = (): void => {
    setErrorMessage(null);
    onChange(null);
  };

  const displaySrc = getDisplaySrc();

  return (
    <div className={className}>
      <div className='flex items-center gap-3'>
        <div className='relative'>
          <Thumbnail
            src={displaySrc}
            alt={alt}
            className='size-24'
          />
          {isPending ? (
            <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-surface/70'>
              <Spinner label='사진 올리는 중' />
            </div>
          ) : null}
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-wrap gap-2'>
            <label
              htmlFor={inputId}
              aria-disabled={isPending}
              className='inline-flex h-7 cursor-pointer items-center rounded-lg border border-border bg-surface px-2.5 text-note font-medium text-fg transition hover:bg-surface-hover aria-disabled:pointer-events-none aria-disabled:opacity-40'
            >
              {displaySrc ? '사진 바꾸기' : '사진 선택'}
            </label>
            <input
              id={inputId}
              type='file'
              accept={IMAGE_CONTENT_TYPES.join(',')}
              disabled={isPending}
              onChange={(event) => void handleFileChange(event)}
              className='sr-only'
            />
            {displaySrc ? (
              <Button
                variant='ghost'
                size='sm'
                disabled={isPending}
                onClick={handleRemoveClick}
              >
                사진 삭제
              </Button>
            ) : null}
          </div>
          <span className='text-note text-fg-subtle'>JPG·PNG·WEBP, 5MB 이하</span>
        </div>
      </div>
      {errorMessage ? <p className={`${ERROR_CLASS} mt-2`}>{errorMessage}</p> : null}
    </div>
  );
}
