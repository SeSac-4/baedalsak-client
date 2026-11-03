import type { ReactNode } from 'react';

import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/ui/toast';

/**
 * 토스트 톤별로 띄워 보는 버튼 묶음.
 * @returns 버튼 묶음
 */
export function GalleryToastDemo(): ReactNode {
  const toast = useToast();

  return (
    <>
      <Button
        variant='secondary'
        onClick={() => toast('결제 완료', 'success')}
      >
        완료 토스트
      </Button>
      <Button
        variant='secondary'
        onClick={() => toast('이미 처리된 주문이에요.')}
      >
        안내 토스트
      </Button>
    </>
  );
}
