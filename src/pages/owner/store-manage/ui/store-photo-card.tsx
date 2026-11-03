import { useState, type ReactNode } from 'react';

import type { StoreDetail } from '@/entities/store';
import { ImageUploadCard } from '@/features/store/upload-image';
import { parseStoreRequest, useUpdateStore } from '@/features/store/upsert-store';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { useToast } from '@/shared/ui/toast';

export interface StorePhotoCardProps {
  store: StoreDetail;
}

const SAVED_MESSAGE = '가게 사진을 저장했어요.';

/**
 * 가게 사진 카드 (O-04). 사진을 고르면 바로 S3에 올리고, '사진 저장'을 눌러야 가게에 반영한다.
 * 저장은 가게 수정(PUT, 전체 교체)에 저장된 가게 정보와 새 사진 키를 함께 보낸다.
 * @param props store(내 가게)
 * @returns 가게 사진 카드 요소
 */
export function StorePhotoCard({ store }: StorePhotoCardProps): ReactNode {
  const toast = useToast();
  const [imageKey, setImageKey] = useState<string | null>(store.imageKey);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { mutateAsync: updateStore, isPending } = useUpdateStore(store.id);
  const isChanged = imageKey !== store.imageKey;

  /** 고른 사진(또는 사진 없음)을 가게에 저장한다. */
  const handleSaveClick = async (): Promise<void> => {
    try {
      await updateStore(parseStoreRequest(store, { imageKey }));
      toast(SAVED_MESSAGE, 'success');
    } catch (error: unknown) {
      toast(getErrorMessage(error));
    }
  };

  return (
    <Card className='flex flex-col gap-3'>
      <h2 className='font-bold text-fg'>가게 사진</h2>
      <ImageUploadCard
        storeId={store.id}
        target='STORE'
        imageUrl={store.imageUrl}
        value={imageKey}
        onChange={setImageKey}
        onPendingChange={setIsUploading}
        alt={store.name}
        hint='JPG·PNG·WEBP, 5MB 이하. 저장을 눌러야 고객 화면에 반영돼요.'
      />
      <Button
        size='lg'
        block
        disabled={!isChanged || isUploading || isPending}
        onClick={() => void handleSaveClick()}
      >
        사진 저장
      </Button>
    </Card>
  );
}
