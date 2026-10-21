import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';

const PRIMARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg bg-role px-4 text-body font-medium text-white transition hover:brightness-110';
const SECONDARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg border border-border bg-surface px-4 text-body font-medium text-fg transition hover:bg-surface-hover';

/**
 * U-07 결제창 닫힘 안내 화면. 안내 문구와 가게로 돌아가기·홈 버튼을 보여 준다.
 * @returns 결제창 닫힘 안내 페이지
 */
export function PaymentFailPage(): ReactNode {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get('storeId');

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
      <div className='flex flex-wrap justify-center gap-2'>
        {storeId ? (
          <Link
            to={`/stores/${storeId}`}
            className={PRIMARY_LINK_CLASS}
          >
            가게로 돌아가기
          </Link>
        ) : null}
        <Link
          to='/'
          className={SECONDARY_LINK_CLASS}
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
