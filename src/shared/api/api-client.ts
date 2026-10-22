import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const REQUEST_TIMEOUT_MS = 10_000;
const AUTH_REFRESH_PATH = '/auth/refresh';
const AUTH_LOGOUT_PATH = '/auth/logout';

/** 인증 이벤트가 생겼을 때 app 레이어에서 실행할 처리 */
export interface AuthEventHandlers {
  /** 갱신 실패(401): 세션이 끝나 다시 로그인해야 함 */
  onSessionExpired: () => void;
  /** 갱신 실패(503·네트워크 등): 로그인은 유지하고 잠시 후 재시도 안내 */
  onServiceUnavailable: () => void;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  isRetried?: boolean;
}

const authEventHandlers: Partial<AuthEventHandlers> = {};
const refreshState: { promise: Promise<void> | null } = { promise: null };

/** 공용 axios 인스턴스. AT·세션 ID는 HttpOnly 쿠키라 쿠키만 함께 보낸다 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
});

/**
 * 인증 이벤트 처리를 등록한다.
 * @param handlers - 세션 만료·서비스 장애 때 실행할 함수
 * @returns 등록을 해제하는 함수
 */
export const setAuthEventHandlers = (handlers: AuthEventHandlers): (() => void) => {
  Object.assign(authEventHandlers, handlers);

  return (): void => {
    delete authEventHandlers.onSessionExpired;
    delete authEventHandlers.onServiceUnavailable;
  };
};

/**
 * 갱신·로그아웃 요청인지 확인한다. 이 요청은 401이어도 다시 갱신하지 않는다.
 * @param url - 요청 경로
 * @returns 인증 창구 요청 여부
 */
const isAuthRequest = (url: string | undefined): boolean => url === AUTH_REFRESH_PATH || url === AUTH_LOGOUT_PATH;

/**
 * 갱신 실패 결과에 맞는 인증 이벤트를 알린다.
 * @param error - 갱신 요청 에러
 */
const handleRefreshError = (error: unknown): void => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    authEventHandlers.onSessionExpired?.();
    return;
  }
  authEventHandlers.onServiceUnavailable?.();
};

/**
 * 세션 ID 쿠키로 새 AT 쿠키를 받는다. 동시에 호출되면 진행 중인 요청 하나를 같이 기다린다.
 * @returns 갱신 완료 Promise
 */
const updateAccessToken = (): Promise<void> => {
  if (!refreshState.promise) {
    refreshState.promise = apiClient
      .post(AUTH_REFRESH_PATH)
      .then((): void => undefined)
      .catch((error: unknown): never => {
        handleRefreshError(error);
        throw error;
      })
      .finally((): void => {
        refreshState.promise = null;
      });
  }
  return refreshState.promise;
};

/**
 * 401 응답이면 AT를 1회 갱신한 뒤 원래 요청을 다시 보낸다.
 * @param error - 응답 에러
 * @returns 재시도한 요청의 응답
 */
const handleResponseError = async (error: unknown): Promise<AxiosResponse> => {
  if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;

  const config = error.config as RetryableRequestConfig | undefined;
  if (!config || config.isRetried || isAuthRequest(config.url)) throw error;

  config.isRetried = true;
  await updateAccessToken();
  return apiClient(config);
};

apiClient.interceptors.response.use(undefined, handleResponseError);
