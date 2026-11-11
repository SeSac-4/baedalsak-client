import { useState, type ReactNode } from 'react';

import type { StoreDetail } from '@/entities/store';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

import { StoreCloseModal } from './store-close-modal';

export interface StoreCloseCardProps {
  store: StoreDetail;
}

/**
 * 가게 폐업 카드 (O-04 맨 아래). 위험한 동작이라 다른 설정과 떨어뜨려 두고, 누르면 확인 모달을 연다.
 * @param props store(내 가게)
 * @returns 가게 폐업 카드 요소
 */
export function StoreCloseCard({ store }: StoreCloseCardProps): ReactNode {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <Card className='mt-4 flex flex-col gap-3 desktop:mt-6'>
      <div className='flex flex-col gap-0.5'>
        <h2 className='font-bold text-fg'>가게 폐업</h2>
        <p className='text-note text-fg-muted'>
          가게와 메뉴가 고객 화면에서 사라지고 되돌릴 수 없어요. 진행 중인 주문이 있으면 폐업할 수 없어요.
        </p>
      </div>
      <Button
        variant='danger-secondary'
        size='lg'
        block
        onClick={() => setIsModalOpen(true)}
      >
        가게 폐업하기
      </Button>
      {isModalOpen ? (
        <StoreCloseModal
          store={store}
          onClose={() => setIsModalOpen(false)}
        />
      ) : null}
    </Card>
  );
}
