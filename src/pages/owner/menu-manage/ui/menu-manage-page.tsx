import { useState, type ReactNode } from 'react';

import { SALE_STATUS_LABEL, useMenuList, type Menu } from '@/entities/menu';
import { useMyStore } from '@/entities/store';
import { getErrorMessage } from '@/shared/api';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { DataTable } from '@/shared/ui/data-table';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';
import { Spinner } from '@/shared/ui/spinner';

import { MenuFormModal } from './menu-form-modal';
import { MenuRemoveModal } from './menu-remove-modal';
import { useToggleSaleStatus } from '../model/use-toggle-sale-status';

/**
 * O-05 메뉴 관리 화면. 메뉴 표(이름·설명·가격·판매 상태·수정·삭제)와 메뉴 추가를 한다.
 * 판매 상태 버튼은 누르면 바로 판매 중 ↔ 품절로 바꾼다. 내 가게는 사장님 라우트 가드가 먼저 불러 둔다.
 * @returns 메뉴 관리 페이지
 */
export function MenuManagePage(): ReactNode {
  const { data: store } = useMyStore();
  const storeId = store?.id ?? 0;
  const { data: menus, error, isPending } = useMenuList(storeId);
  const { mutate: toggleSaleStatus, isPending: isToggling, variables: togglingMenu } = useToggleSaleStatus(storeId);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Menu | null>(null);

  /**
   * 폼 모달을 연다. 메뉴를 넘기면 수정 모드.
   * @param menu 수정할 메뉴 (추가면 null)
   */
  const handleFormOpen = (menu: Menu | null): void => {
    setEditingMenu(menu);
    setIsFormOpen(true);
  };

  return (
    <div className='mx-auto flex max-w-[1100px] flex-col px-4 py-6'>
      <PageHeader
        title='메뉴 관리'
        actions={<Button onClick={() => handleFormOpen(null)}>메뉴 추가</Button>}
      />

      {isPending ? (
        <div className='flex items-center justify-center gap-2 py-10 text-note text-fg-muted'>
          <Spinner label='메뉴 불러오는 중' />
          메뉴를 불러오고 있어요.
        </div>
      ) : null}

      {error ? <EmptyState message={getErrorMessage(error)} /> : null}

      {menus && menus.length > 0 ? (
        <DataTable>
          <thead>
            <tr>
              <th>메뉴</th>
              <th>설명</th>
              <th className='text-right'>가격</th>
              <th>판매 상태</th>
              <th>
                <span className='sr-only'>관리</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => {
              const isOnSale = menu.saleStatus === 'ON_SALE';
              return (
                <tr key={menu.id}>
                  <td className='font-medium whitespace-nowrap'>{menu.name}</td>
                  <td className='min-w-40 text-fg-muted'>{menu.description ?? '-'}</td>
                  <td className='text-right whitespace-nowrap'>{formatPrice(menu.price)}</td>
                  <td>
                    <Button
                      size='sm'
                      variant={isOnSale ? 'primary' : 'secondary'}
                      aria-pressed={isOnSale}
                      aria-label={`${menu.name} 판매 상태: ${SALE_STATUS_LABEL[menu.saleStatus]}`}
                      disabled={isToggling && togglingMenu?.id === menu.id}
                      onClick={() => toggleSaleStatus(menu)}
                    >
                      {SALE_STATUS_LABEL[menu.saleStatus]}
                    </Button>
                  </td>
                  <td>
                    <div className='flex justify-end gap-1.5'>
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={() => handleFormOpen(menu)}
                      >
                        수정
                      </Button>
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={() => setRemoveTarget(menu)}
                      >
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      ) : null}

      {menus && menus.length === 0 ? (
        <EmptyState message='등록된 메뉴가 없어요. 메뉴 추가 버튼으로 첫 메뉴를 등록하세요.' />
      ) : null}
      <p className='mt-3 text-note text-fg-muted'>판매 상태 버튼을 누르면 판매 중 ↔ 품절이 바로 바뀌어요.</p>

      <MenuFormModal
        key={editingMenu?.id ?? 'new'}
        open={isFormOpen}
        storeId={storeId}
        menu={editingMenu}
        onClose={() => setIsFormOpen(false)}
      />
      <MenuRemoveModal
        storeId={storeId}
        menu={removeTarget}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
}
