import { useState, type ReactNode } from 'react';

import { MENU_LIST_MOCK, SALE_STATUS_LABEL, type Menu } from '@/entities/menu';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { DataTable } from '@/shared/ui/data-table';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageHeader } from '@/shared/ui/page-header';

import { MenuFormModal } from './menu-form-modal';

/**
 * O-05 메뉴 관리 화면. 메뉴 표(이름·설명·가격·판매 상태·수정·삭제)와 메뉴 추가 버튼을 보여 준다. (목 데이터)
 * @returns 메뉴 관리 페이지
 */
export function MenuManagePage(): ReactNode {
  const menus = MENU_LIST_MOCK;
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

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

      {menus.length > 0 ? (
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
      ) : (
        <EmptyState message='등록된 메뉴가 없어요. 메뉴 추가 버튼으로 첫 메뉴를 등록하세요.' />
      )}
      <p className='mt-3 text-note text-fg-muted'>판매 상태 버튼을 누르면 판매 중 ↔ 품절이 바로 바뀌어요.</p>

      <MenuFormModal
        key={editingMenu?.id ?? 'new'}
        open={isFormOpen}
        menu={editingMenu}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
}
