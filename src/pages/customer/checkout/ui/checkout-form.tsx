import type { FormEvent, ReactNode } from 'react';

import type { Cart } from '@/entities/cart';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';

export interface CheckoutFormProps {
  cart: Cart;
  /** 가입 시 휴대폰 번호 (읽기 전용 표시) */
  phone: string;
}

const LABEL_CLASS = 'flex flex-col gap-1 text-note font-medium text-fg-muted';

/**
 * 제출 시 새로고침을 막는다. (API 연동 전 임시)
 * @param event 폼 제출 이벤트
 */
const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
  event.preventDefault();
};

/**
 * U-04 주문서 폼. 배달 주소·요청사항 입력과 주문 요약·결제 금액을 보여 준다.
 * @param props cart(주문할 장바구니), phone(연락처)
 * @returns 주문서 폼 요소
 */
export function CheckoutForm({ cart, phone }: CheckoutFormProps): ReactNode {
  return (
    <form
      onSubmit={handleSubmit}
      className='grid gap-4 tablet:grid-cols-[1fr_300px] tablet:items-start'
    >
      <div className='flex flex-col gap-4'>
        <Card className='flex flex-col gap-3'>
          <strong className='text-body text-fg'>배달 주소</strong>
          <div className='grid gap-3 tablet:grid-cols-2'>
            <label className={`${LABEL_CLASS} tablet:col-span-2`}>
              주소
              <Input
                name='address'
                defaultValue='서울 성동구 성수이로 113'
              />
            </label>
            <label className={LABEL_CLASS}>
              상세 주소
              <Input
                name='addressDetail'
                defaultValue='302호'
              />
            </label>
            <label className={LABEL_CLASS}>
              연락처
              <Input
                name='phone'
                value={phone}
                readOnly
              />
            </label>
          </div>
        </Card>

        <Card className='flex flex-col gap-3'>
          <strong className='text-body text-fg'>요청사항</strong>
          <div className='grid gap-3 tablet:grid-cols-2'>
            <label className={LABEL_CLASS}>
              가게 사장님께
              <Input
                name='storeRequest'
                maxLength={200}
                placeholder='예: 김밥 썰어 주세요'
              />
            </label>
            <label className={LABEL_CLASS}>
              라이더님께
              <Input
                name='riderRequest'
                maxLength={200}
                placeholder='예: 문 앞에 두고 벨 눌러 주세요'
              />
            </label>
          </div>
        </Card>
      </div>

      <aside className='tablet:sticky tablet:top-4'>
        <Card className='flex flex-col gap-2'>
          <strong className='text-body text-fg'>{cart.storeName}</strong>
          <ul className='flex flex-col gap-1 text-note tabular-nums'>
            {cart.items.map((item) => (
              <li
                key={item.menuId}
                className='flex justify-between gap-2'
              >
                <span className='text-fg'>
                  {item.menuName} × {item.quantity}
                </span>
                <span className='text-fg'>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
            <li className='flex justify-between gap-2'>
              <span className='text-fg-muted'>배달비</span>
              <span className='text-fg'>{formatPrice(cart.deliveryFee)}</span>
            </li>
          </ul>
          <div className='flex justify-between border-t border-border pt-2 text-body font-bold tabular-nums'>
            <span className='text-fg'>결제 금액</span>
            <span className='text-fg'>{formatPrice(cart.totalAmount)}</span>
          </div>
          <Button
            type='submit'
            size='lg'
            block
          >
            결제하기
          </Button>
        </Card>
      </aside>
    </form>
  );
}
