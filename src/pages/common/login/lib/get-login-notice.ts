/** 다른 화면이 로그인 화면으로 보낼 때 router state에 담는 안내 (예: 비밀번호 재설정 완료) */
interface LoginNoticeState {
  notice: string;
}

/**
 * router state가 로그인 안내를 담고 있는지 확인한다.
 * @param state - location.state (모양을 알 수 없다)
 * @returns 안내 state 여부
 */
const isLoginNoticeState = (state: unknown): state is LoginNoticeState =>
  typeof state === 'object' && state !== null && typeof (state as Partial<LoginNoticeState>).notice === 'string';

/**
 * router state에서 로그인 화면 상단 안내 문구를 꺼낸다.
 * @param state - location.state
 * @returns 안내 문구 (없으면 null)
 */
export const getLoginNotice = (state: unknown): string | null => (isLoginNoticeState(state) ? state.notice : null);
