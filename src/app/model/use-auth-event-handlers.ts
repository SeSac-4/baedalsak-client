import { useEffect } from 'react';

import { clearSession } from '@/entities/session';
import { queryClient, setAuthEventHandlers } from '@/shared/api';
import { useToast } from '@/shared/ui/toast';

const SERVICE_UNAVAILABLE_MESSAGE = '잠시 후 다시 시도해 주세요.';

/**
 * 공용 axios의 인증 이벤트(세션 만료·서비스 장애)를 세션 정리·토스트로 연결한다.
 * 세션이 끝나면 내 정보를 비로그인(null)으로 바꾸고, 로그인 화면 이동은 AuthGuard가 맡는다
 * (로그인·회원가입 화면에서 만료가 나도 화면을 옮기지 않도록).
 */
export function useAuthEventHandlers(): void {
  const toast = useToast();

  useEffect(
    () =>
      setAuthEventHandlers({
        onSessionExpired: (): void => clearSession(queryClient),
        onServiceUnavailable: (): void => toast(SERVICE_UNAVAILABLE_MESSAGE),
      }),
    [toast],
  );
}
