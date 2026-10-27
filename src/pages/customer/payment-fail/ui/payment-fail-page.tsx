import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';

const PRIMARY_LINK_CLASS =
  'inline-flex h-9 items-center rounded-lg bg-role px-4 text-body font-medium text-white transition hover:brightness-110';
/** 토스가 failUrl에 붙여 주는 실패 사유 쿼리 이름 */
const TOSS_FAIL_MESSAGE_PARAM = 'message';

/**
 * 토스 failUrl 쿼리에서 실패 사유를 읽는다.
 * @param searchParams 현재 주소의 쿼리
 * @returns 실패 사유, 결제창 닫기·승인 실패처럼 쿼리가 없으면 null
 */
const parseTossFailMessage = (searchParams: URLSearchParams): string | null =>
  searchParams.get(TOSS_FAIL_MESSAGE_PARAM)?.trim() || null;

/**
 * U-07 결제 실패·취소 안내 화면. 토스 failUrl 복귀·결제창 닫기·승인 실패(400) 모두 같은 안내 문구와
 * 다시 주문하기 버튼을 보여 주고, 토스 실패면 사유를 한 줄 덧붙인다.
 * 다시 주문하기는 장바구니(U-03)로 이동한다.
 * @returns 결제 실패 안내 페이지
 */
export function PaymentFailPage(): ReactNode {
  const [searchParams] = useSearchParams();
  const tossFailMessage = parseTossFailMessage(searchParams);

  return (
    <div className='mx-auto flex max-w-[520px] flex-col items-center gap-4 px-4 py-6 text-center'>
      <div
        aria-hidden
        className='flex size-14 items-center justify-center rounded-full bg-warn-soft text-title font-bold text-warn'
      >
        !
      </div>
      <div className='flex flex-col gap-1'>
        <h2 className='text-title font-bold text-fg'>결제가 진행되지 않았어요</h2>
        <p className='text-body text-fg-muted'>출금은 되지 않았어요. 장바구니에 다시 담아 주문해 주세요.</p>
        {tossFailMessage && <p className='text-note text-fg-muted'>사유: {tossFailMessage}</p>}
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
