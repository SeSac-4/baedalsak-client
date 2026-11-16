import type { LatLngLiteral } from '../kakao-map';

/** 위치를 기다리는 최대 시간 (ms) */
const POSITION_TIMEOUT_MS = 10_000;
/** 이 시간 안에 받은 위치는 다시 쓴다 (ms) */
const POSITION_MAX_AGE_MS = 5 * 60_000;

/**
 * 브라우저 위치(navigator.geolocation)로 현재 좌표를 받는다. 처음 부르면 브라우저가 위치 권한을 묻는다.
 * @returns 현재 좌표
 * @throws 위치를 지원하지 않으면 Error, 권한 거부·시간 초과 등은 GeolocationPositionError
 */
export const getCurrentPosition = (): Promise<LatLngLiteral> =>
  new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('이 브라우저는 위치 확인을 지원하지 않아요.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      reject,
      { timeout: POSITION_TIMEOUT_MS, maximumAge: POSITION_MAX_AGE_MS },
    );
  });

/**
 * 위치 권한을 거부해서 실패했는지 확인한다.
 * @param error - getCurrentPosition 이 던진 오류
 * @returns 권한 거부면 true
 */
export const isLocationDenied = (error: unknown): boolean =>
  error instanceof GeolocationPositionError && error.code === error.PERMISSION_DENIED;
