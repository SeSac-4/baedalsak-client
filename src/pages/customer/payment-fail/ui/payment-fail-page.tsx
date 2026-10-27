import type { ReactNode } from 'react';
import { Link } from 'react-router';

const PRIMARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg bg-role px-4 text-body font-medium text-white transition hover:brightness-110';

/**
 * U-07 결제창 닫힘 안내 화면. 안내 문구와 다시 주문하기 버튼을 보여 준다.
 * 다시 주문하기는 장바구니(U-03)로 이동한다.
 * @returns 결제창 닫힘 안내 페이지
 */
export function PaymentFailPage(): ReactNode {
  return (
    <div className='mx-auto flex max-w-[520px] flex-col items-center gap-4 px-4 py-6 text-center'>
      <div
        aria-hidden
        className='flex size-14 items-center justify-center rounded-full bg-warn-soft text-title font-bold text-warn'
      >
        !
      </div>
      <div className='flex flex-col gap-1'>
        <h2 className='text-title font-bold text-fg'>결제창을 닫았어요</h2>
        <p className='text-body text-fg-muted'>결제가 진행되지 않았어요. 장바구니에 다시 담아 주문해 주세요.</p>
      </div>
      <Link
        to='/cart'
        className={PRIMARY_LINK_CLASS}
      >
        다시 주문하기
      </Link>
    </div>
  );
}
