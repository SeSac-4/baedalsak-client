import { useState, type ReactNode } from 'react';

import { useMenuList, type Menu } from '@/entities/menu';
import { useMyStore } from '@/entities/store';
import { getErrorMessage } from '@/shared/api';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { Icon } from '@/shared/ui/icon';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

import { MenuFormModal } from './menu-form-modal';
import { MenuManageCard } from './menu-manage-card';
import { MenuRemoveModal } from './menu-remove-modal';

/**
 * O-05 메뉴 관리 화면. 메뉴 목록과 판매 상태 전환, 메뉴 추가·수정·삭제를 한다.
 * 내 가게는 사장님 라우트 가드가 먼저 불러 둔다.
 * @returns 메뉴 관리 페이지
 */
export function MenuManagePage(): ReactNode {
  const { data: store } = useMyStore();
  const storeId = store?.id ?? 0;
  const { data: menus, error, isPending } = useMenuList(storeId);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Menu | null>(null);
  const hasMenus = menus !== undefined && menus.length > 0;

  /**
   * 폼 모달을 연다. 메뉴를 넘기면 수정 모드.
   * @param menu 수정할 메뉴 (추가면 null)
   */
  const handleFormOpen = (menu: Menu | null): void => {
    setEditingMenu(menu);
    setIsFormOpen(true);
  };

  return (
    <div className='mx-auto flex w-full max-w-[560px] flex-col gap-3 tablet:gap-3.5 desktop:mx-0 desktop:max-w-[640px] desktop:gap-4'>
      <PageHeader
        title='메뉴 관리'
        badge={menus ? <Badge tone='role'>{menus.length}개</Badge> : null}
        description={hasMenus ? '판매·품절 스위치는 누르면 바로 반영돼요.' : null}
        actions={
          <Button onClick={() => handleFormOpen(null)}>
            <Icon
              name='plus'
              size={16}
            />
            메뉴 추가
          </Button>
        }
      />

      {isPending ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='메뉴 불러오는 중' />
          메뉴를 불러오고 있어요.
        </div>
      ) : null}

      {error ? <EmptyState message={getErrorMessage(error)} /> : null}

      {hasMenus ? (
        <Card
          padding='none'
          className='px-5'
        >
          <ul aria-label='등록된 메뉴'>
            {menus.map((menu) => (
              <MenuManageCard
                key={menu.id}
                storeId={storeId}
                menu={menu}
                onEditClick={handleFormOpen}
                onRemoveClick={setRemoveTarget}
              />
            ))}
          </ul>
        </Card>
      ) : null}

      {menus && menus.length === 0 ? (
        <EmptyState
          icon='bag'
          message='등록된 메뉴가 없어요'
          description='메뉴 추가 버튼으로 첫 메뉴를 등록하세요.'
        />
      ) : null}

      {isFormOpen ? (
        <MenuFormModal
          storeId={storeId}
          menu={editingMenu}
          onClose={() => setIsFormOpen(false)}
        />
      ) : null}
      <MenuRemoveModal
        storeId={storeId}
        menu={removeTarget}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
}
