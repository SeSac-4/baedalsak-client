import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

import { cn } from '@/shared/lib/cn';

export interface NavPillItem {
  to: string;
  label: string;
  /** 이름 옆 개수 (신규 주문 등). 0이거나 없으면 숨김 */
  count?: number;
  /** true면 하위 경로에서는 선택 표시를 하지 않는다 (홈 '/' 등) */
  end?: boolean;
  /** true면 누를 수 없게 흐리게 보여 준다 (가게 등록 전 주문 관리 등) */
  disabled?: boolean;
  /** disabled일 때 누르면 실행 (이유를 토스트로 알리는 등). 없으면 눌리지 않는다 */
  onDisabledClick?: () => void;
}

export interface NavPillsProps {
  items: NavPillItem[];
  /** 스크린리더용 메뉴 이름 (예: '주요 메뉴') */
  label: string;
  /** horizontal: 헤더 아래 가로 줄(넘치면 가로 스크롤) · vertical: PC 사이드 메뉴 */
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const PILL_CLASS =
  'inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-note whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink';

/**
 * 역할별 주요 메뉴. 지금 화면은 검은 알약으로 표시하고 aria-current=page를 붙인다.
 * @param props items(메뉴 목록), label, orientation, className
 * @returns 내비게이션 요소
 */
export function NavPills({ items, label, orientation = 'horizontal', className }: NavPillsProps): ReactNode {
  const isVertical = orientation === 'vertical';

  return (
    <nav
      aria-label={label}
      className={cn('flex gap-1', isVertical ? 'flex-col' : 'overflow-x-auto', className)}
    >
      {items.map((item) =>
        item.disabled && item.onDisabledClick ? (
          <button
            key={item.to}
            type='button'
            aria-disabled
            onClick={item.onDisabledClick}
            className={cn(PILL_CLASS, 'text-fg-disabled')}
          >
            {item.label}
          </button>
        ) : item.disabled ? (
          <span
            key={item.to}
            aria-disabled
            className={cn(PILL_CLASS, 'text-fg-disabled')}
          >
            {item.label}
          </span>
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                PILL_CLASS,
                isActive ? 'bg-fg font-semibold text-canvas' : 'text-fg-muted hover:bg-surface-hover hover:text-fg',
              )
            }
          >
            {item.label}
            {item.count ? (
              <span className='h-4.5 min-w-4.5 rounded-full bg-role px-1.25 text-center text-[11px] leading-4.5 font-bold text-role-on tabular-nums'>
                {item.count}
              </span>
            ) : null}
          </NavLink>
        ),
      )}
    </nav>
  );
}
