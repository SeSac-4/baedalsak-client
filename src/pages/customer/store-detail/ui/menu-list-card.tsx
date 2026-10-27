import type { ReactNode } from 'react';

import { MenuCard, useMenuList, type Menu } from '@/entities/menu';
import type { StoreDetail } from '@/entities/store';
import { CartReplaceModal, useAddToCart } from '@/features/cart/add-to-cart';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Spinner } from '@/shared/ui/spinner';

export interface MenuListCardProps {
  store: StoreDetail;
}

/**
 * 담기 버튼 문구를 고른다.
 * @param menu - 메뉴
 * @returns 품절이면 '품절', 아니면 '담기'
 */
const getAddLabel = (menu: Menu): string => (menu.saleStatus === 'SOLD_OUT' ? '품절' : '담기');

/**
 * U-02 메뉴 목록. 담기를 누를 때마다 1개씩 담고, 다른 가게 장바구니면 교체 확인 모달을 띄운다.
 * 영업 중이 아니거나 품절인 메뉴는 담기를 막는다.
 * @param props store(가게 상세)
 * @returns 메뉴 목록 카드 요소
 */
export function MenuListCard({ store }: MenuListCardProps): ReactNode {
  const { data: menus, error, isPending } = useMenuList(store.id);
  const { addToCart, pendingReplace, confirmReplace, cancelReplace, isPending: isAdding } = useAddToCart();

  /**
   * 메뉴 1개를 담는다.
   * @param menu - 담을 메뉴
   */
  const handleAddClick = (menu: Menu): void => {
    addToCart({ storeId: store.id, menuId: menu.id, quantity: 1 });
  };

  return (
    <Card>
      {isPending ? (
        <div className='flex items-center justify-center gap-2 py-6 text-note text-fg-muted'>
          <Spinner label='메뉴 불러오는 중' />
          메뉴를 불러오고 있어요.
        </div>
      ) : null}

      {error ? <p className='py-6 text-center text-body text-fg-muted'>{getErrorMessage(error)}</p> : null}

      {menus && menus.length === 0 ? (
        <p className='py-6 text-center text-body text-fg-muted'>등록된 메뉴가 없어요.</p>
      ) : null}

      {menus && menus.length > 0 ? (
        <ul className='divide-y divide-border'>
          {menus.map((menu) => (
            <li key={menu.id}>
              <MenuCard
                menu={menu}
                action={
                  <Button
                    size='sm'
                    variant={menu.saleStatus === 'ON_SALE' && store.isOpenNow ? 'primary' : 'secondary'}
                    disabled={menu.saleStatus === 'SOLD_OUT' || !store.isOpenNow || isAdding}
                    onClick={() => handleAddClick(menu)}
                  >
                    {getAddLabel(menu)}
                  </Button>
                }
              />
            </li>
          ))}
        </ul>
      ) : null}

      <CartReplaceModal
        open={pendingReplace !== null}
        isPending={isAdding}
        onConfirm={confirmReplace}
        onCancel={cancelReplace}
      />
    </Card>
  );
}
