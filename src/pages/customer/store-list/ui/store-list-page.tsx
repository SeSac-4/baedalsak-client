import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';

import { isCategoryCode, useCategoryList, type Category, type CategoryCode } from '@/entities/category';
import { StoreCard, useStoreList, type StoreSummary } from '@/entities/store';
import { getErrorMessage } from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import { EmptyState } from '@/shared/ui/empty-state';
import { Icon, type IconName } from '@/shared/ui/icon';
import { IconButton } from '@/shared/ui/icon-button';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

import { PromoBanner } from './promo-banner';

const CATEGORY_PARAM = 'category';
/** PC에서 전체 가게 목록을 고른 상태 (쿼리가 없으면 카테고리 타일을 보여 준다) */
const ALL_STORES_PARAM = 'ALL';
const ALL_STORES_LABEL = '전체 가게';
const HOME_TITLE = '오늘은 뭐 먹을까요?';

/** 카테고리별 타일 아이콘 */
const CATEGORY_ICON: Record<CategoryCode, IconName> = {
  KOREAN: 'rice-bowl',
  SNACK: 'skewer',
  CHICKEN: 'chicken',
  CHINESE: 'noodle',
  PIZZA: 'pizza',
  CAFE_DESSERT: 'cafe',
};

/**
 * 카테고리 코드를 표시명으로 바꾼다.
 * @param categories - 카테고리 목록
 * @param code - 카테고리 코드
 * @returns 카테고리 표시명 (없으면 빈 문자열)
 */
const getCategoryName = (categories: Category[] | undefined, code: CategoryCode): string =>
  categories?.find((item) => item.code === code)?.name ?? '';

/**
 * 타일에 보여 줄 가게 수 문구를 만든다.
 * @param count - 가게 수
 * @returns 예: 가게 3곳, 준비 중
 */
const formatStoreCount = (count: number): string => (count > 0 ? `가게 ${count}곳` : '준비 중');

/**
 * 가장 낮은 배달비를 구한다.
 * @param stores - 가게 목록
 * @returns 가장 낮은 배달비 (가게가 없으면 null)
 */
const getMinDeliveryFee = (stores: StoreSummary[]): number | null =>
  stores.length > 0 ? Math.min(...stores.map((store) => store.deliveryFee)) : null;

/**
 * U-01 가게 목록(홈) 화면. PC는 카테고리 타일에서 고르면 그 가게 목록으로 들어가고, 태블릿·모바일은 칩과 목록을 바로 보여 준다.
 * 고른 카테고리는 URL(?category=)에 둔다.
 * @returns 가게 목록 페이지
 */
export function StoreListPage(): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get(CATEGORY_PARAM);
  const category = isCategoryCode(categoryParam) ? categoryParam : undefined;
  const hasPicked = category !== undefined || categoryParam === ALL_STORES_PARAM;

  const { data: categories } = useCategoryList();
  const { data: allStores, refetch: refetchAllStores } = useStoreList();
  const { data: stores, error, isPending, isFetching, refetch } = useStoreList(category);
  const listTitle = category ? getCategoryName(categories, category) : ALL_STORES_LABEL;

  /**
   * 카테고리를 URL 쿼리로 고른다. 쿼리가 없으면 PC에서 타일을 보여 준다.
   * @param value - 쿼리 값 (없으면 쿼리 제거)
   */
  const handleCategoryChange = (value?: string): void => {
    setSearchParams(value ? { [CATEGORY_PARAM]: value } : {});
  };

  /** 가게 목록을 다시 받는다. */
  const handleRefreshClick = (): void => {
    void refetch();
    void refetchAllStores();
  };

  /**
   * 카테고리 칩을 만든다.
   * @param label - 표시명
   * @param isSelected - 선택 여부
   * @param value - 쿼리 값
   * @returns 칩 요소
   */
  const renderChip = (label: string, isSelected: boolean, value: string): ReactNode => (
    <button
      key={value}
      type='button'
      aria-pressed={isSelected}
      onClick={() => handleCategoryChange(value)}
      className={cn(
        'h-10 flex-none rounded-full border px-3.5 whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink',
        isSelected ? 'border-role bg-role font-bold text-role-on' : 'border-border bg-surface text-fg',
      )}
    >
      {label}
    </button>
  );

  /**
   * 카테고리 타일을 만든다 (PC).
   * @param label - 표시명
   * @param icon - 아이콘
   * @param count - 가게 수
   * @param value - 쿼리 값
   * @returns 타일 요소
   */
  const renderTile = (label: string, icon: IconName, count: number, value: string): ReactNode => (
    <li key={value}>
      <button
        type='button'
        aria-label={`${label}, 가게 ${count}곳`}
        onClick={() => handleCategoryChange(value)}
        className='flex h-45 w-full flex-col items-center justify-center gap-2.5 rounded-card border border-border bg-surface transition hover:border-border-strong hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink'
      >
        <span className='flex size-16 items-center justify-center rounded-full bg-role-soft text-role-ink'>
          <Icon
            name={icon}
            size={28}
          />
        </span>
        <span className='font-bold text-fg'>{label}</span>
        <span className='text-note text-fg-muted'>{formatStoreCount(count)}</span>
      </button>
    </li>
  );

  return (
    <div className='mx-auto flex w-full flex-col gap-3 px-4 pt-4 pb-6 tablet:max-w-[760px] tablet:gap-3.5 tablet:px-6 tablet:pt-5 tablet:pb-10 desktop:max-w-[1180px] desktop:gap-4 desktop:px-10 desktop:pt-7 desktop:pb-12'>
      <PromoBanner
        openCount={allStores?.filter((store) => store.isOpenNow).length ?? 0}
        minDeliveryFee={getMinDeliveryFee(allStores ?? [])}
      />

      <div>
        {hasPicked ? (
          <button
            type='button'
            onClick={() => handleCategoryChange()}
            className='hidden min-h-9 text-note text-fg-muted hover:text-fg desktop:block'
          >
            ‹ 카테고리 전체
          </button>
        ) : null}
        <PageHeader
          title={
            <>
              <span className='desktop:hidden'>{HOME_TITLE}</span>
              <span className='hidden desktop:inline'>{hasPicked ? listTitle : HOME_TITLE}</span>
            </>
          }
          description={
            <span className='hidden desktop:inline'>
              {hasPicked ? `가게 ${stores?.length ?? 0}곳` : '카테고리를 고르면 그 가게들이 나와요.'}
            </span>
          }
          actions={
            <IconButton
              icon='refresh'
              label='새로고침'
              disabled={isFetching}
              onClick={handleRefreshClick}
            />
          }
        />
      </div>

      {hasPicked ? null : (
        <ul
          aria-label='카테고리'
          className='hidden grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 desktop:grid'
        >
          {renderTile(ALL_STORES_LABEL, 'grid', allStores?.length ?? 0, ALL_STORES_PARAM)}
          {categories?.map((item) =>
            renderTile(
              item.name,
              CATEGORY_ICON[item.code],
              allStores?.filter((store) => store.category === item.code).length ?? 0,
              item.code,
            ),
          )}
        </ul>
      )}

      <div className={cn('flex flex-col gap-3 tablet:gap-3.5 desktop:gap-4', !hasPicked && 'desktop:hidden')}>
        <div
          role='group'
          aria-label='카테고리'
          className='-mx-4 flex [scrollbar-width:none] gap-1.5 overflow-x-auto px-4 pb-0.5 tablet:mx-0 tablet:flex-wrap tablet:overflow-visible tablet:px-0'
        >
          {renderChip('전체', !category, ALL_STORES_PARAM)}
          {categories?.map((item) => renderChip(item.name, item.code === category, item.code))}
        </div>

        {isPending ? (
          <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
            <Spinner label='가게 목록 불러오는 중' />
            가게 목록을 불러오고 있어요.
          </div>
        ) : null}

        {error ? <EmptyState message={getErrorMessage(error)} /> : null}

        {stores && stores.length > 0 ? (
          <ul className='grid grid-cols-1 items-start gap-3 tablet:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] tablet:gap-3.5 desktop:gap-4'>
            {stores.map((store) => (
              <li key={store.id}>
                <Link
                  to={`/stores/${store.id}`}
                  className='block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink'
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

        {stores && stores.length === 0 ? (
          <EmptyState
            message={`아직 ${listTitle} 가게가 없어요`}
            description='다른 카테고리를 골라 보세요.'
          />
        ) : null}
      </div>
    </div>
  );
}
