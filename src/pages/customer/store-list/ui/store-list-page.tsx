import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { CATEGORY_LIST_MOCK } from '@/entities/category';
import { STORE_LIST_MOCK, StoreCard } from '@/entities/store';
import { Chip } from '@/shared/ui/chip';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';

/**
 * 카테고리 코드를 표시명으로 바꾼다.
 * @param code 카테고리 코드
 * @returns 카테고리 표시명 (없으면 빈 문자열)
 */
const getCategoryName = (code: string): string => CATEGORY_LIST_MOCK.find((item) => item.code === code)?.name ?? '';

/**
 * U-01 가게 목록(홈) 화면. 카테고리 칩과 가게 카드 그리드를 보여 준다. (목 데이터)
 * @returns 가게 목록 페이지
 */
export function StoreListPage(): ReactNode {
  const openCount = STORE_LIST_MOCK.filter((store) => store.isOpenNow).length;

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col gap-6 px-4 py-6'>
      <section className='rounded-xl border border-border bg-surface p-5'>
        <p className='text-note text-fg-muted'>성수동2가 · 성수이로 113</p>
        <h2 className='mt-1 text-title font-bold text-fg'>오늘 점심, 동네 가게에서 바로</h2>
        <p className='mt-1 text-body text-fg-muted'>지금 주문할 수 있는 가게 {openCount}곳</p>
      </section>

      <section>
        <PageHeader title='가게' />
        <div className='mb-4 flex flex-wrap gap-2'>
          <Chip selected>전체</Chip>
          {CATEGORY_LIST_MOCK.map((category) => (
            <Chip key={category.code}>{category.name}</Chip>
          ))}
        </div>

        {STORE_LIST_MOCK.length > 0 ? (
          <ul className='grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3'>
            {STORE_LIST_MOCK.map((store) => (
              <li key={store.id}>
                <Link
                  to={`/stores/${store.id}`}
                  className='block rounded-xl focus-visible:ring-2 focus-visible:ring-role/50 focus-visible:outline-none'
                >
                  <StoreCard
                    store={store}
                    categoryName={getCategoryName(store.category)}
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message='이 카테고리에는 아직 가게가 없어요.' />
        )}
      </section>
    </div>
  );
}
