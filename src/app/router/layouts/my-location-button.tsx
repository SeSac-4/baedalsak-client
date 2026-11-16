import type { ReactNode } from 'react';

import { isLocationDenied } from '@/shared/lib/geolocation';
import { useCurrentRegion } from '@/shared/lib/kakao-map';
import { Icon } from '@/shared/ui/icon';

/**
 * 위치 확인 결과를 버튼 문구로 바꾼다.
 * @param state - 동 이름, 로딩·오류 상태
 * @returns 버튼에 보일 문구
 */
const getLocationText = ({
  dong,
  isPending,
  error,
}: {
  dong: string | undefined;
  isPending: boolean;
  error: Error | null;
}): string => {
  if (isPending) return '위치 확인 중…';
  if (isLocationDenied(error)) return '위치 권한 필요';
  return dong ?? '위치 찾기 실패';
};

/**
 * 헤더의 내 위치 버튼. 브라우저 위치로 현재 동네를 보여 주고, 누르면 다시 확인한다.
 * 권한을 거부했으면 브라우저 설정에서 허용한 뒤 누르면 된다.
 * @returns 내 위치 버튼 요소
 */
export function MyLocationButton(): ReactNode {
  const { data: region, isPending, isFetching, error, refetch } = useCurrentRegion();
  const text = getLocationText({ dong: region?.dong, isPending, error });

  return (
    <button
      type='button'
      onClick={() => void refetch()}
      disabled={isFetching}
      title={region?.address}
      aria-label={`내 위치: ${region?.address ?? text}. 다시 확인`}
      className='flex min-h-11 min-w-0 items-center gap-1 rounded-control px-2 text-body font-semibold text-fg transition hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink disabled:cursor-progress'
    >
      <Icon
        name='location'
        size={18}
        className='shrink-0 text-role'
      />
      <span className='truncate'>{text}</span>
    </button>
  );
}
