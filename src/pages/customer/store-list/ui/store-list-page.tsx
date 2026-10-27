import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';

import { isCategoryCode, useCategoryList, type Category, type CategoryCode } from '@/entities/category';
import { StoreCard, useStoreList } from '@/entities/store';
import { getErrorMessage } from '@/shared/api';
import { Chip } from '@/shared/ui/chip';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

const CATEGORY_PARAM = 'category';

/**
 * 카테고리 코드를 표시명으로 바꾼다.
 * @param categories - 카테고리 목록
 * @param code - 카테고리 코드
 * @returns 카테고리 표시명 (없으면 빈 문자열)
 */
const getCategoryName = (categories: Category[] | undefined, code: CategoryCode): string =>
  categories?.find((item) => item.code === code)?.name ?? '';

/**
 * U-01 가게 목록(홈) 화면. 카테고리 칩(?category=)으로 가게 목록을 걸러 보여 준다.
 * @returns 가게 목록 페이지
 */
export function StoreListPage(): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get(CATEGORY_PARAM);
  const category = isCategoryCode(categoryParam) ? categoryParam : undefined;

  const { data: categories } = useCategoryList();
  const { data: stores, error, isPending } = useStoreList(category);
  const openCount = stores?.filter((store) => store.isOpenNow).length ?? 0;

  /**
   * 카테고리 칩을 고르면 URL 쿼리를 바꾼다. (전체는 쿼리 제거)
   * @param code - 고른 카테고리 (전체면 undefined)
   */
  const handleCategoryClick = (code?: CategoryCode): void => {
    setSearchParams(code ? { [CATEGORY_PARAM]: code } : {});
  };

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col gap-6 px-4 py-6'>
      <section className='rounded-xl border border-border bg-surface p-5'>
        <h2 className='text-title font-bold text-fg'>오늘 점심, 동네 가게에서 바로</h2>
        <p className='mt-1 text-body text-fg-muted'>지금 주문할 수 있는 가게 {openCount}곳</p>
      </section>

      <section>
        <PageHeader title='가게' />
        <div className='mb-4 flex flex-wrap gap-2'>
          <Chip
            selected={!category}
            onClick={() => handleCategoryClick()}
          >
            전체
          </Chip>
          {categories?.map((item) => (
            <Chip
              key={item.code}
              selected={item.code === category}
              onClick={() => handleCategoryClick(item.code)}
            >
              {item.name}
            </Chip>
          ))}
        </div>

        {isPending ? (
          <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
            <Spinner label='가게 목록 불러오는 중' />
            가게 목록을 불러오고 있어요.
          </div>
        ) : null}

        {error ? <EmptyState message={getErrorMessage(error)} /> : null}

        {stores && stores.length > 0 ? (
          <ul className='grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3'>
            {stores.map((store) => (
              <li key={store.id}>
                <Link
                  to={`/stores/${store.id}`}
                  className='block rounded-xl focus-visible:ring-2 focus-visible:ring-role/50 focus-visible:outline-none'
                >
                  <StoreCard
                    store={store}
                    categoryName={getCategoryName(categories, store.category)}
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {stores && stores.length === 0 ? <EmptyState message='이 카테고리에는 아직 가게가 없어요.' /> : null}
      </section>
    </div>
  );
}
