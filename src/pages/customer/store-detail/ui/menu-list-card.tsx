import type { ReactNode } from 'react';

import type { Cart } from '@/entities/cart';
import { MenuCard, useMenuList, type Menu } from '@/entities/menu';
import type { StoreDetail } from '@/entities/store';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Spinner } from '@/shared/ui/spinner';

import { useAddToCart } from '../model/use-add-to-cart';
import { CartReplaceModal } from './cart-replace-modal';

export interface MenuListCardProps {
  store: StoreDetail;
  /** 내 장바구니 (담긴 수량·교체 안내에 쓴다) */
  cart: Cart | undefined;
}

/**
 * 이 가게 메뉴가 장바구니에 담긴 수량을 구한다.
 * @param cart - 장바구니
 * @param store - 가게 상세
 * @param menu - 메뉴
 * @returns 담긴 수량 (다른 가게 장바구니면 0)
 */
const getCartQuantity = (cart: Cart | undefined, store: StoreDetail, menu: Menu): number =>
  cart?.storeId === store.id ? (cart.items.find((item) => item.menuId === menu.id)?.quantity ?? 0) : 0;

/**
 * U-02 메뉴 목록. 담기를 누를 때마다 1개씩 담고, 다른 가게 장바구니면 교체 확인 모달을 띄운다.
 * 영업 중이 아니거나 품절인 메뉴는 담기를 막는다.
 * @param props store(가게 상세), cart(내 장바구니)
 * @returns 메뉴 목록 카드 요소
 */
export function MenuListCard({ store, cart }: MenuListCardProps): ReactNode {
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
    <Card
      padding='none'
      className='px-5 py-1'
    >
      <div className='flex items-center pt-4 pb-1'>
        <h2 className='flex-1 font-bold text-fg'>메뉴</h2>
        {menus ? <span className='text-note text-fg-muted'>{menus.length}개</span> : null}
      </div>

      {isPending ? (
        <div className='flex items-center justify-center gap-2 py-6 text-note text-fg-muted'>
          <Spinner label='메뉴 불러오는 중' />
          메뉴를 불러오고 있어요.
        </div>
      ) : null}

      {error ? <p className='py-6 text-center text-fg-muted'>{getErrorMessage(error)}</p> : null}

      {menus && menus.length === 0 ? <p className='py-6 text-center text-fg-muted'>등록된 메뉴가 없어요.</p> : null}

      {menus && menus.length > 0 ? (
        <ul>
          {menus.map((menu) => {
            const quantity = getCartQuantity(cart, store, menu);
            return (
              <li
                key={menu.id}
                className='border-t border-border'
              >
                <MenuCard
                  menu={menu}
                  action={
                    <>
                      <Button
                        variant='outline'
                        aria-label={`${menu.name} 담기`}
                        disabled={menu.saleStatus === 'SOLD_OUT' || !store.isOpenNow || isAdding}
                        onClick={() => handleAddClick(menu)}
                      >
                        담기
                      </Button>
                      {quantity > 0 ? (
                        <span className='text-note font-semibold text-role-ink'>{quantity}개 담김</span>
                      ) : null}
                    </>
                  }
                />
              </li>
            );
          })}
        </ul>
      ) : null}

      <CartReplaceModal
        open={pendingReplace !== null}
        isPending={isAdding}
        currentStoreName={cart?.storeName ?? null}
        currentItemCount={cart?.items.length ?? 0}
        onConfirm={confirmReplace}
        onCancel={cancelReplace}
      />
    </Card>
  );
}
