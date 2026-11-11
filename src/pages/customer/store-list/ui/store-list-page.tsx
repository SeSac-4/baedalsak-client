import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useEffectEvent, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';

import { isCategoryCode, useCategoryList, type Category, type CategoryCode } from '@/entities/category';
import { StoreCard, storeKeys, useStoreList, useStoreListSummary } from '@/entities/store';
import { getErrorMessage } from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import { useDebouncedValue } from '@/shared/lib/use-debounced-value';
import { useIntersection } from '@/shared/lib/use-intersection';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Icon, type IconName } from '@/shared/ui/icon';
import { IconButton } from '@/shared/ui/icon-button';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

import { PromoBanner } from './promo-banner';
import { StoreSearchInput } from './store-search-input';

const CATEGORY_PARAM = 'category';
const KEYWORD_PARAM = 'q';
/** PC에서 전체 가게 목록을 고른 상태 (쿼리가 없으면 카테고리 타일을 보여 준다) */
const ALL_STORES_PARAM = 'ALL';
const ALL_STORES_LABEL = '전체 가게';
const HOME_TITLE = '오늘은 뭐 먹을까요?';
/** 목록 끝에 닿기 이만큼 전에 다음 페이지를 미리 받는다 */
const PREFETCH_MARGIN = '200px';

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
 * U-01 가게 목록(홈) 화면. PC는 카테고리 타일에서 고르면 그 가게 목록으로 들어가고, 태블릿·모바일은 칩과 목록을 바로 보여 준다.
 * 고른 카테고리(?category=)와 가게 이름 검색어(?q=)는 URL에 둔다. 검색어는 입력이 300ms 멈추면 반영하고, 검색 중이면 PC도 목록을 보여 준다.
 * @returns 가게 목록 페이지
 */
export function StoreListPage(): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get(CATEGORY_PARAM);
  const category = isCategoryCode(categoryParam) ? categoryParam : undefined;
  const keywordParam = searchParams.get(KEYWORD_PARAM) ?? '';
  const keyword = keywordParam.trim();
  const isSearching = keyword !== '';
  const hasPicked = category !== undefined || categoryParam === ALL_STORES_PARAM || isSearching;

  const [keywordInput, setKeywordInput] = useState<string>(keywordParam);
  const debouncedKeyword = useDebouncedValue(keywordInput.trim());
  const [prevKeywordParam, setPrevKeywordParam] = useState<string>(keywordParam);
  // 뒤로가기·'카테고리 전체'처럼 입력 밖에서 URL 검색어가 바뀌면 검색창도 맞춘다
  if (keywordParam !== prevKeywordParam) {
    setPrevKeywordParam(keywordParam);
    if (keywordParam !== debouncedKeyword) setKeywordInput(keywordParam);
  }

  const { data: categories } = useCategoryList();
  const queryClient = useQueryClient();
  const { data: summary, refetch: refetchSummary } = useStoreListSummary();
  const {
    data,
    error,
    isPending,
    isFetching,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useStoreList(category, keyword || undefined);
  const stores = data?.pages.flatMap((page) => page.content);
  const listCount = (category ? summary?.categoryCounts[category] : summary?.totalCount) ?? 0;
  // 다음 페이지가 실패하면 감지를 멈춘다 (계속 보이는 감지 요소가 요청을 반복하지 않게). 목록 아래 '다시 시도'로 다시 받는다.
  const loadMoreRef = useIntersection(() => void fetchNextPage(), {
    enabled: hasNextPage && !isFetchingNextPage && !isFetchNextPageError && !isPlaceholderData,
    rootMargin: PREFETCH_MARGIN,
  });
  const listTitle = category ? getCategoryName(categories, category) : ALL_STORES_LABEL;

  /**
   * PC 제목 아래 설명을 고른다. 검색 결과는 전체 개수를 주지 않아 개수 없이 보여 준다.
   * @returns 설명 문구
   */
  const getListDescription = (): string => {
    if (isSearching) return `'${keyword}' 검색 결과`;
    return hasPicked ? `가게 ${listCount}곳` : '카테고리를 고르면 그 가게들이 나와요.';
  };

  /**
   * 검색어를 URL 쿼리에 반영한다. 방문 기록은 쌓지 않고, 카테고리 쿼리는 그대로 둔다.
   * @param value - 앞뒤 공백을 뺀 검색어 (빈 문자열이면 쿼리 제거)
   */
  const setKeywordParam = (value: string): void => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(KEYWORD_PARAM, value);
        else next.delete(KEYWORD_PARAM);
        return next;
      },
      { replace: true },
    );
  };

  /**
   * 입력이 멈춘 검색어를 URL에 반영한다. 이미 같으면(예: 뒤로가기로 맞춘 값) 그대로 둔다.
   * @param value - 디바운스된 검색어
   */
  const syncKeywordParam = useEffectEvent((value: string): void => {
    if (value !== keyword) setKeywordParam(value);
  });

  useEffect(() => {
    syncKeywordParam(debouncedKeyword);
  }, [debouncedKeyword]);

  /**
   * 카테고리를 URL 쿼리로 고른다. 검색어는 유지한다.
   * @param value - 쿼리 값 (없으면 카테고리 쿼리 제거)
   */
  const handleCategoryChange = (value?: string): void => {
    setSearchParams({
      ...(value ? { [CATEGORY_PARAM]: value } : {}),
      ...(isSearching ? { [KEYWORD_PARAM]: keyword } : {}),
    });
  };

  /** PC에서 카테고리 타일 화면으로 돌아간다. 검색어도 함께 지운다. */
  const handleHomeClick = (): void => {
    setSearchParams({});
  };

  /** 엔터를 누르면 기다리지 않고 바로 검색한다. */
  const handleSearchSubmit = (): void => {
    setKeywordParam(keywordInput.trim());
  };

  /** 검색어를 지우고 바로 반영한다. */
  const handleSearchClear = (): void => {
    setKeywordInput('');
    setKeywordParam('');
  };

  /** 가게 목록을 첫 페이지부터 다시 받고, 통계도 다시 받는다. */
  const handleRefreshClick = (): void => {
    void queryClient.resetQueries({ queryKey: storeKeys.list(category, keyword || undefined) });
    void refetchSummary();
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
        openCount={summary?.openCount ?? 0}
        minDeliveryFee={summary?.minDeliveryFee ?? null}
      />

      <div>
        {hasPicked ? (
          <button
            type='button'
            onClick={handleHomeClick}
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
          description={<span className='hidden desktop:inline'>{getListDescription()}</span>}
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

      <StoreSearchInput
        value={keywordInput}
        onChange={setKeywordInput}
        onSubmit={handleSearchSubmit}
        onClear={handleSearchClear}
      />

      {hasPicked ? null : (
        <ul
          aria-label='카테고리'
          className='hidden grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 desktop:grid'
        >
          {renderTile(ALL_STORES_LABEL, 'grid', summary?.totalCount ?? 0, ALL_STORES_PARAM)}
          {categories?.map((item) =>
            renderTile(item.name, CATEGORY_ICON[item.code], summary?.categoryCounts[item.code] ?? 0, item.code),
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

        {error && !isFetchNextPageError ? <EmptyState message={getErrorMessage(error)} /> : null}

        {stores && stores.length > 0 ? (
          <ul className='grid grid-cols-1 gap-3 tablet:grid-cols-2 tablet:gap-3.5 desktop:grid-cols-3 desktop:gap-4'>
            {stores.map((store) => (
              <li key={store.id}>
                <Link
                  to={`/stores/${store.id}`}
                  className='block h-full rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink'
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

        {hasNextPage ? (
          <div
            ref={loadMoreRef}
            className='flex min-h-10 items-center justify-center gap-2 text-note text-fg-muted'
          >
            {isFetchingNextPage ? (
              <>
                <Spinner label='가게 더 불러오는 중' />
                가게를 더 불러오고 있어요.
              </>
            ) : null}
            {isFetchNextPageError && !isFetchingNextPage ? (
              <div
                role='alert'
                className='flex flex-col items-center gap-2 py-2'
              >
                <span>가게를 더 불러오지 못했어요. {getErrorMessage(error)}</span>
                <Button
                  variant='secondary'
                  onClick={() => void fetchNextPage()}
                >
                  다시 시도
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}

        {stores && stores.length === 0 && isSearching ? (
          <EmptyState
            message={`${category ? `${listTitle}에서 ` : ''}'${keyword}'에 맞는 가게가 없어요`}
            description='다른 이름으로 찾아보세요.'
          />
        ) : null}

        {stores && stores.length === 0 && !isSearching ? (
          <EmptyState
            message={`아직 ${listTitle} 가게가 없어요`}
            description='다른 카테고리를 골라 보세요.'
          />
        ) : null}
      </div>
    </div>
  );
}
