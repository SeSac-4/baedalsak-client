import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { clearSession } from '@/entities/session';
import { queryClient, setAuthEventHandlers } from '@/shared/api';
import { useToast } from '@/shared/ui/toast';

const LOGIN_PATH = '/login';
const SERVICE_UNAVAILABLE_MESSAGE = '잠시 후 다시 시도해 주세요.';

/** 공용 axios의 인증 이벤트(세션 만료·서비스 장애)를 화면 이동·토스트로 연결한다 */
export function useAuthEventHandlers(): void {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(
    () =>
      setAuthEventHandlers({
        onSessionExpired: (): void => {
          clearSession(queryClient);
          navigate(LOGIN_PATH, { replace: true });
        },
        onServiceUnavailable: (): void => toast(SERVICE_UNAVAILABLE_MESSAGE),
      }),
    [navigate, toast],
  );
}
