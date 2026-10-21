import type { ReactNode } from 'react';

import { StoreForm } from '@/features/store/upsert-store';
import { Card } from '@/shared/ui/card';
import { PageHeader } from '@/shared/ui/page-header';

/**
 * O-00 가게 등록 화면. 가게 이름은 가입 때 입력한 값이 기본으로 채워진다. (목 데이터)
 * @returns 가게 등록 페이지
 */
export function StoreCreatePage(): ReactNode {
  return (
    <div className='mx-auto flex max-w-[700px] flex-col gap-4 px-4 py-6'>
      <PageHeader title='새 가게 등록' />
      <Card>
        <StoreForm
          defaultValues={{ name: '싹싹김밥 성수점', category: 'SNACK' }}
          submitLabel='가게 등록'
        />
      </Card>
      <p className='text-note text-fg-muted'>
        등록하면 임시 중지 상태로 시작해요. 영업시간(기본 09:00~22:00)을 확인하고 운영을 시작하세요.
      </p>
    </div>
  );
}
